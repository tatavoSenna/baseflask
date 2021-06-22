import json
from app import ma
from app.models.documents import Document, DocumentTemplate
from app.serializers.user_serializers import UserSerializer


class DocumentTemplateSerializer(ma.SQLAlchemyAutoSchema):
    user = ma.Nested(UserSerializer)

    class Meta:
        exclude = (
            "company_id",
            "textfile",
            "workflow",
            "signers",
            "company",
            "documents",
        )
        model = DocumentTemplate


class DocumentTemplateListSerializer(ma.SQLAlchemyAutoSchema):
    user = ma.Function(lambda obj: {
        "email": obj.user.email
    })

    class Meta:
        exclude = (
            "textfile",
            "workflow",
            "form",
            "signers",
            "company",
            "documents",
            "variables",
        )
        model = DocumentTemplate
        include_fk = True
        include_relationships = True


class DocumentListSerializer(ma.SQLAlchemyAutoSchema):
    # user = ma.Nested(UserSerializer)
    user = ma.Function(lambda obj: {
        "name": obj.user.name,
        "email": obj.user.email
    })
    status = ma.Method("get_status")

    class Meta:
        model = Document
        include_relationships = True
        exclude = (
            'form',
            'template',
            'envelope',
            'workflow',
            'variables',
            'versions',
            'signers',
            'form',
            'current_step',
            'company',
        )

    def get_status(self, obj):
        if obj.workflow:
            current_node = obj.workflow["current_node"]
            nodes = obj.workflow.get('nodes', None)
            if nodes:
                current_status = nodes.get(
                    current_node, {"title": "-"}).get('title', {"title": "-"})

            return current_status


class DocumentSerializer(ma.SQLAlchemyAutoSchema):
    template = ma.Nested(DocumentTemplateSerializer)
    user = ma.Nested(UserSerializer)
    envelope = ma.Method("get_envelope_dict")
    workflow = ma.Method("get_workflow")
    info = ma.Method("get_variables")

    class Meta:
        model = Document
        include_fk = True
        include_relationships = True
        exclude = ('form', 'template')

    def get_workflow(self, obj):
        if obj.workflow:
            ordered_nodes = order_nodes(obj.workflow["nodes"])
            return {
                "current_step": obj.workflow["current_node"],
                "created_by": obj.workflow["created_by"],
                "steps": generate_steps(obj.workflow, ordered_nodes)
            }

    def get_variables(self, obj):
        if obj.form and obj.variables:
            return map_variables_to_form(obj.variables, obj.form)

    def get_envelope_dict(self, obj):
        if obj.envelope:
            try:
                envelope_dict = json.loads(obj.envelope)
                return envelope_dict
            except:
                return None
        return None


def order_nodes(nodes):
    ordered_nodes = []
    previous_node_of = {}

    for node in nodes:
        if nodes[node]["next_node"]:
            previous_node_of[nodes[node]["next_node"]] = node
        else:
            ordered_nodes.append(node)

    if (len(ordered_nodes) != 1) or (len(previous_node_of) != len(nodes) - 1):
        return

    for i in range(len(previous_node_of)):
        previous_node = previous_node_of[ordered_nodes[0]]
        ordered_nodes = [previous_node] + ordered_nodes

    if len(nodes) == len(ordered_nodes):
        return ordered_nodes
    else:
        return


def generate_steps(obj_workflow, ordered_nodes):
    steps = []
    for node in ordered_nodes:
        steps.append({
            'step': node,
            'title': obj_workflow['nodes'][node].get('title', ''),
            'group': obj_workflow['nodes'][node].get('responsible_group', ""),
            'responsible_users': obj_workflow['nodes'][node].get('responsible_users', ''),
            'changed_by': obj_workflow['nodes'][node].get('changed_by', ''),
            'color': obj_workflow['nodes'][node].get('color', '#696969')
        })
    return steps


def map_variables_to_form(variables, form):
    print('\n')
    print(form)
    print('\n')
    print(variables)
    print('\n')

    filled_form = []
    group_index = 0
    for group in form:
        filled_form.append({
            "title": group["title"],
            "fields": []
        })

        question_index = 0
        for question in group['fields']:

            if question['type'] == 'structured_list':
                variables_obj = {
                    "subtitle": question['label'],
                    "items": [],
                    "type": question['type'],
                    "struct_name": f'structured_list_{group_index}_{question_index}'
                }
                for item_variables in variables[f'structured_list_{group_index}_{question_index}']:
                    item_list = []
                    for variable_name, value in item_variables.items():

                        for var_obj in question['structure']:
                            if var_obj['variable']['name'] == variable_name:
                                label = var_obj['label']
                                variable_type = var_obj['type']

                        item_list.append({
                            "label": label,
                            "variable": variable_name,
                            "value": value,
                            "type": variable_type
                        })

                    variables_obj['items'].append(item_list)

                filled_form[-1]["fields"].append(variables_obj)

            elif question['type'] == 'structured_checkbox':
                variables_obj = {
                    "subtitle": question['label'],
                    "items": [],
                    "type": question['type'],
                    "struct_name": f'structured_checkbox_{group_index}_{question_index}'
                }
                for item_variables in variables[f'structured_checkbox_{group_index}_{question_index}']:
                    item_list = []
                    for variable_name, value in item_variables.items():
                        if variable_name == 'OPTION':
                            label = 'Opção'
                        else:
                            for var_obj in question['structure']:
                                if var_obj['variable']['name'] == variable_name:
                                    label = var_obj['label']
                                    variable_type = var_obj['type']

                        item_list.append({
                            "label": label,
                            "variable": variable_name,
                            "value": value,
                            "type": variable_type
                        })

                    variables_obj['items'].append(item_list)

                filled_form[-1]["fields"].append(variables_obj)

            elif question['type'] == 'person':
                variables_obj = {
                    "subtitle": question['label'],
                    "items": [],
                    "type": question['type'],
                    "struct_name": f'template_{group_index}_{question_index}',
                    "person_type": variables[f'template_{group_index}_{question_index}']['PERSON_TYPE']
                }

                for variable_name, value in variables[f'template_{group_index}_{question_index}'].items():

                    if variable_name != 'PERSON_TYPE':
                        variables_obj['items'].append({
                            "field_type": variable_name.lower(),
                            "value": value
                        })

                filled_form[-1]["fields"].append(variables_obj)

                # This 'if' is here so templates whose variables are not objects still work
            elif type(question['variable']) == str:
                if variables.get(question['variable']):
                    filled_form[-1]["fields"].append({
                        "label": question['label'],
                        "variable": question['variable'],
                        "value": variables[question['variable']],
                    })
            elif type(question['variable']) == list:
                for list_variable in question['variable']:
                    if variables.get(list_variable['name']):
                        filled_form[-1]["fields"].append({
                            "label": question['label'],
                            "variable": list_variable['name'],
                            "value": variables[list_variable['name']],
                            "type": question['type']
                        })
            else:
                if variables.get(question['variable']['name']):
                    if question['type'] in ['radio', 'dropdown', 'checkbox']:
                        filled_form[-1]["fields"].append({
                            "label": question['label'],
                            "variable": question['variable']['name'],
                            "value": variables[question['variable']['name']],
                            "type": question['type'],
                            "options": question['options']
                        })
                    else:
                        filled_form[-1]["fields"].append({
                            "label": question['label'],
                            "variable": question['variable']['name'],
                            "value": variables[question['variable']['name']],
                            "type": question['type']
                        })

            question_index += 1

        group_index += 1

    return filled_form
