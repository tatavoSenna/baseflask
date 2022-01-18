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
    template_name = ma.Method("get_template_name")

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
            else:
                current_status = "-"

            return current_status

    def get_template_name(self, obj):
        if obj.template  and not obj.is_folder:
            return obj.template.name
        return  '-'


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
    if ordered_nodes is None:
        return steps
    for node in ordered_nodes:
        user_id_list = obj_workflow['nodes'][node].get('responsible_users', '')
        user_name_list = obj_workflow['nodes'][node].get('responsible_users_name','')
        responsible_users_list = []
        for (user_id, user_name) in zip(user_id_list,user_name_list):
            responsible_users_list.append({
                'id': user_id,
                'name': user_name
            })
        steps.append({
            'step': node,
            'title': obj_workflow['nodes'][node].get('title', ''),
            'group': {
                'id': obj_workflow['nodes'][node].get('responsible_group', ""),
                'name': obj_workflow['nodes'][node].get('responsible_group_name','')},
            'responsible_users': responsible_users_list,
            'due_date': obj_workflow["nodes"][node].get('due_date',''),
            'changed_by': obj_workflow['nodes'][node].get('changed_by', ''),
            'color': obj_workflow['nodes'][node].get('color', '#696969')
        })
    return steps


def map_variables_to_form(variables, form):

    filled_form = []
    group_index = 0
    for group in form:
        filled_form.append({
            "title": group["title"],
            "fields": []
        })

        question_index = 0
        for question in group['fields']:

            if question['type'] == 'separator':
                filled_form[-1]["fields"].append({
                    "type": "separator",
                    "title": question.get("title"),
                })
            elif type(question['variable']) == str:
                if variables.get(question['variable']):
                    filled_form[-1]["fields"].append({
                        "label": question['label'],
                        "variable": question['variable'],
                        "value": variables[question['variable']],
                    })
            elif question['type'] == 'structured_list' and f'structured_list_{group_index}_{question_index}' in variables:
                variables_obj = {
                    "subtitle": question['label'],
                    "items": [],
                    "type": question['type'],
                    "struct_name": f'structured_list_{group_index}_{question_index}'
                }
                for variable_item in variables[f'structured_list_{group_index}_{question_index}']:
                    item_list = []
                    structure_index = 0

                    for var_obj in question['structure']:

                        if var_obj['type'] == 'separator':
                            item_list.append({
                                'type': 'separator',
                                'title': var_obj.get('title'),
                            })
                            continue

                        variable_name = var_obj['variable']['name']
                        value = variable_item.get(variable_name)
                        if value != None:
                            label = var_obj['label']
                            variable_type = var_obj['type']
                            options = var_obj.get('options')
                            item_list.append({
                                "label": label,
                                "variable": variable_name,
                                "value": value,
                                "type": variable_type,
                                "options": options
                            })

                    variables_obj['items'].append(item_list)

                filled_form[-1]["fields"].append(variables_obj)
            elif question['type'] == 'structured_checkbox' and f'structured_checkbox_{group_index}_{question_index}' in variables:
                variables_obj = {
                    "subtitle": question['label'],
                    "items": [],
                    "options": question['options'],
                    "structure": question['structure'],
                    "info": question.get('info'),
                    "type": question['type'],
                    "variable": question['variable']['name']
                }

                for variable_item in variables[f'structured_checkbox_{group_index}_{question_index}']:
                    item_list = []

                    for option in variables_obj['options']:
                        if variable_item['OPTION'] == option['value']:
                            option['checked'] = True
                            option['struct_values'] = {}
                            for variable_name, value in variable_item.items():
                                if variable_name != 'OPTION':
                                    option['struct_values'][variable_name] = value

                    for variable_name, value in variable_item.items():
                        if variable_name == 'OPTION':
                            label = 'Opção'
                            variable_type = 'text'
                        else:
                            for var_obj in question['structure']:

                                if var_obj['type'] == 'separator':
                                    item_list.append({
                                        'type': 'separator',
                                        'title': var_obj.get('title'),
                                    })
                                    continue

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
            elif question['type'] == 'person' and variables[f'person_{group_index}_{question_index}'] in variables:
                variables_obj = {
                    "subtitle": question['label'],
                    "items": [],
                    "type": question['type'],
                    "struct_name": f'person_{group_index}_{question_index}',
                    "person_type": variables[f'person_{group_index}_{question_index}']['PERSON_TYPE']
                }

                for variable_name, value in variables[f'person_{group_index}_{question_index}'].items():

                    if variable_name != 'PERSON_TYPE':
                        if variable_name in ['CPF', 'CNPJ', 'RG', 'CEP']:
                            label = variable_name
                        else:
                            label = variable_name.capitalize()

                        variables_obj['items'].append({
                            "field_type": variable_name.lower(),
                            "value": value,
                            "label": label
                        })

                filled_form[-1]["fields"].append(variables_obj)
            elif question['type'] == 'variable_image' and 'image_' + question['variable']['name'] in variables:
                filled_form[-1]["fields"].append({
                    "label": question['label'],
                    "variable": question['variable']['name'],
                    "type": 'variable_image',
                    "value": variables['image_' + question['variable']['name']]
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
            elif question['type'] in ['radio', 'dropdown', 'checkbox'] and question['variable']['name'] in variables:
                    filled_form[-1]["fields"].append({
                        "label": question['label'],
                        "variable": question['variable']['name'],
                        "value": variables[question['variable']['name']],
                        "type": question['type'],
                        "options": question['options']
                    })
            elif question['variable']['name'] in variables:
                        filled_form[-1]["fields"].append({
                            "label": question['label'],
                            "variable": question['variable']['name'],
                            "value": variables[question['variable']['name']],
                            "type": question['type']
                        })

            question_index += 1

        group_index += 1

    return filled_form
