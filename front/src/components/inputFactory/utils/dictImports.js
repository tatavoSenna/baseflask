import RadioField from 'components/radioField'
import CnpjField from 'components/cnpjField'
import CpfField from 'components/cpfField'
import EmailField from 'components/emailField'
import CurrencyField from 'components/currencyField'
import TextField from 'components/textField'
import DropdownField from 'components/dropdownField'
import DateField from 'components/dateField'
import StateField from 'components/stateField'
import CnaeField from 'components/cnaeField'
import CityField from 'components/cityField'
import CheckboxField from 'components/checkboxField'
import NumberField from 'components/numberField'
import PercentageField from 'components/percentageField'
import BankField from 'components/bankField'
import TimeField from 'components/timeField'
import TextAreaField from 'components/textAreaField'
import ImageField from 'components/imageField'
import StructuredList from 'components/structuredList'
import StructuredCheckbox from 'components/structuredCheckbox'
import AddressField from 'components/addressField'
import DatabaseField from 'components/databaseField'
import InternalDatabaseField from 'components/internalDatabaseField'
import PersonField from 'components/personField'

export const inputTypes = {
	radio: RadioField,
	cnpj: CnpjField,
	cpf: CpfField,
	email: EmailField,
	currency: CurrencyField,
	dropdown: DropdownField,
	date: DateField,
	time: TimeField,
	state: StateField,
	checkbox: CheckboxField,
	cnae: CnaeField,
	city: CityField,
	number: NumberField,
	percentage: PercentageField,
	bank: BankField,
	text_area: TextAreaField,
	variable_image: ImageField,
	person: PersonField,
	address: AddressField,
	structured_list: StructuredList,
	structured_checkbox: StructuredCheckbox,
	database: DatabaseField,
	internal_database: InternalDatabaseField,
	default: TextField,
}
