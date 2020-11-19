import json
from app import ma
from app.models.documents import Document, DocumentTemplate
from app.serializers.user_serializers import UserSerializer


class DocumentTemplateSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "company_id",
            "textfile",
            "workflow",
            "signers",
            "filetype",
            "company",
            "documents",
        )
        model = DocumentTemplate


class DocumentTemplateListSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "company_id",
            "textfile",
            "workflow",
            "form",
            "signers",
            "filetype",
            "company",
            "documents",
        )
        model = DocumentTemplate
        include_fk = True


class DocumentListSerializer(ma.SQLAlchemyAutoSchema):
    # user = ma.Nested(UserSerializer)
    user = ma.Function(lambda obj: {
        "name": obj.user.name,
        "surname": obj.user.surname,
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
    variables = ma.Method("get_variables")
    signers = ma.Method("get_signers")

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

    def get_signers(self, obj):
        signers_list = []
        if obj.signers:
            for signer in obj.signers:
                signers_list.append({
                    "id": signer["id"],
                    "name": signer["name"],
                    "email": signer["email"]
                })
        return signers_list


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
            'title': obj_workflow['nodes'][node]['title'],
            'groups': obj_workflow['nodes'][node]['responsible_groups']
        })
    return steps


def map_variables_to_form(variables, form):

    filled_form = []
    for group in form:
        filled_form.append({
            "title": group["title"],
            "fields": []
        })
        for question in group['fields']:
            filled_form[-1]["fields"].append({
                # MUDAR PARA question['label'] após refatoração do form
                "label": question['value'],
                "variable": question['variable'],
                "value": variables[question['variable']]
            })
    return filled_form
