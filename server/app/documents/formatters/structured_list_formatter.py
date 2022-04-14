from sentry_sdk import capture_exception
from app import jinja_env


class StructuredListFormatter:
    def __init__(self, variables, specs):
        self._specs = specs
        self._variables = variables

    def __str__(self):
        if self._specs["doc_display_style"]:
            try:
                return getattr(self, self._specs["doc_display_style"])
            except Exception as e:
                capture_exception(e)
        else:
            return self.default

    @property
    def default(self):
        try:
            return str(self.text)
        except Exception as e:
            capture_exception(e)

    @property
    def text(self):
        try:
            row_template = self._specs["extra_style_params"]["row_template"]
            rows_list = []
            jinja_template = jinja_env.from_string(row_template)
            for index, item in enumerate(self._variables):
                item["INDEX"] = index + 1
                filled_text = jinja_template.render(item)
                rows_list.append(filled_text)
            return self._specs["extra_style_params"]["separator"].join(rows_list)
        except Exception as e:
            capture_exception(e)

    @property
    def table(self):
        try:
            table_list = []
            table_title = self._specs["extra_style_params"]["title"]
            lines = self._specs["extra_style_params"]["lines"]
            i = 0
            for item in self._variables:
                table_rows = [f"<tr><td><p>{table_title.format(i+1)}</p></td></tr>"]
                i += 1
                for lineSpec in lines:
                    columns = []
                    for info in lineSpec:
                        for label, value in info.items():
                            columns.append(f"<td>{label}</td><td>{item[value]}</td>")
                    table_rows.append("<tr>" + "".join(columns) + "</tr>")

                table_list.append("".join(table_rows))

            return (
                "<figure class='table'><table><tbody>"
                + "".join(table_list)
                + "</tbody></table></figure>"
            )
        except Exception as e:
            capture_exception(e)

    @property
    def numbering(self):
        return_variables = []
        try:
            if self._specs["extra_style_params"]["row_template"] != "":
                row_template = self._specs["extra_style_params"]["row_template"]
                jinja_template = jinja_env.from_string(row_template)
                for index, item in enumerate(self._variables):
                    item["INDEX"] = index + 1
                    filled_text = jinja_template.render(item)
                    return_variables.append(filled_text)
            else:
                for variable in self._variables:
                    for var_key in variable:
                        return_variables.append(variable[var_key])
            return return_variables
        except Exception as e:
            capture_exception(e)
