from app.models.user import User, Group
from app.workflow.exceptions import (
    ResponsibleGroupNotFound,
    ResponsibleUserNotFound,
    ResponsibleUserNotInGroup,
)


def format_workflow_responsible_group(group: dict) -> dict:
    """Generates a dict with the correct structure to be used as a responsible group on the workflow json

    Args:
        group (dict): { id, name }

    Raises:
        ReponsibleGroupNotFound: Raised if a group with the id provided as parameter is not found

    Returns:
        dict: The formatted dict
    """
    group = Group.query.filter_by(id=int(group["id"])).first()
    if group:
        return {"id": group.id, "name": group.name}
    else:
        raise ResponsibleGroupNotFound


def format_workflow_responsible_users(users: list, group: dict) -> list:
    """Generates a dict with the correct structure to be used as a responsible user list on the workflow json

    Args:
        users_ids (list): The list of the ids of the responsible users
        group_id (int): The id of the group. The function checks if all users belong to the group.

    Raises:
        ResponsibleUserNotFound: At least one of the users ids in the list do not exist
        ResponsibleUserNotInGroup: At least onde of the users is not on the specified group

    Returns:
        dict: The formatted responsible users list
    """
    users_ids = [int(user["id"]) for user in users]
    users = User.query.filter(User.id.in_(users_ids)).all()
    if len(users) == len(users_ids):
        responsible_users = []
        for user in users:
            user_groups_ids = [
                participates_on.group_id for participates_on in user.participates_on
            ]
            if int(group["id"]) in user_groups_ids:
                responsible_users.append(
                    {"id": user.id, "name": user.name, "email": user.email}
                )
            else:
                raise ResponsibleUserNotInGroup
        return responsible_users
    else:
        raise ResponsibleUserNotFound
