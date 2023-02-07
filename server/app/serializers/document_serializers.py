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
    user = ma.Function(lambda obj: {"email": obj.user.email})

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
    user = ma.Function(lambda obj: {"name": obj.user.name, "email": obj.user.email})
    status = ma.Method("get_status")
    template_name = ma.Method("get_template_name")

    class Meta:
        model = Document
        include_relationships = True
        exclude = (
            "form",
            "template",
            "envelope",
            "workflow",
            "variables",
            "versions",
            "signers",
            "form",
            "company",
        )

    def get_status(self, obj):
        if obj.workflow:
            current_node = obj.workflow["current_node"]
            nodes = obj.workflow.get("nodes", None)
            if nodes:
                current_status = nodes.get(current_node, {"title": "-"}).get(
                    "title", {"title": "-"}
                )
            else:
                current_status = "-"

            return current_status

    def get_template_name(self, obj):
        if obj.template and not obj.is_folder:
            return obj.template.name
        return "-"


class DocumentSerializer(ma.SQLAlchemyAutoSchema):
    template = ma.Nested(DocumentTemplateSerializer)
    user = ma.Nested(UserSerializer)
    envelope = ma.Method("get_envelope_dict")
    workflow = ma.Method("get_workflow")

    class Meta:
        model = Document
        include_fk = True
        include_relationships = True
        exclude = ("template",)

    def get_workflow(self, obj):
        if obj.workflow:
            ordered_nodes = order_nodes(obj.workflow["nodes"])
            return {
                "current_step": obj.workflow["current_node"],
                "created_by": obj.workflow["created_by"],
                "steps": generate_steps(obj.workflow, ordered_nodes),
            }

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
        responsible_group = obj_workflow["nodes"][node].get("responsible_group", "")
        responsible_users = obj_workflow["nodes"][node].get("responsible_users", "")
        responsible_users_list = []
        # Check if responsible_users and responsible_group are in the old format
        if type(responsible_group) == str:
            user_name_list = obj_workflow["nodes"][node].get(
                "responsible_users_name", ""
            )
            for user_id, user_name in zip(responsible_users, user_name_list):
                responsible_users_list.append({"id": user_id, "name": user_name})
            responsible_group_dict = {
                "id": obj_workflow["nodes"][node].get("responsible_group", ""),
                "name": obj_workflow["nodes"][node].get("responsible_group_name", ""),
            }
        else:
            responsible_users_list = responsible_users
            responsible_group_dict = responsible_group

        steps.append(
            {
                "step": node,
                "title": obj_workflow["nodes"][node].get("title", ""),
                "group": responsible_group_dict,
                "responsible_users": responsible_users_list,
                "due_date": obj_workflow["nodes"][node].get("due_date", ""),
                "changed_by": obj_workflow["nodes"][node].get("changed_by", ""),
                "color": obj_workflow["nodes"][node].get("color", "#696969"),
            }
        )
    return steps
