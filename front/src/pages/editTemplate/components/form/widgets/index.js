import { TextWidget } from './textWidget'
import { NumberWidget } from './numberWidget'
import { CurrencyWidget } from './currencyWidget'
import { DateWidget } from './dateWidget'
import { EmailWidget } from './emailWidget'
import { CheckboxWidget } from './checkboxWidget'
import { RadioWidget } from './radioWidget'
import { TimeWidget } from './timeWidget'
import { DropdownWidget } from './dropdownWidget'
import { BankWidget } from './bankWidget'
import { AddressWidget } from './addressWidget'
import { DatabaseWidget } from './databaseWidget'
import { CnaeWidget } from './cnaeWidget'
import { CpfWidget } from './CpfWidget'
import { CnpjWidget } from './CnpjWidget'
import { ParagraphWidget } from './paragraphWidget'
import { SeparatorWidget } from './separatorWidget'
import { StructuredListWidget } from './structuredListWidget'
import { PersonWidget } from './personWidget'

export const widgets = {
	text: TextWidget,
	text_area: ParagraphWidget,
	currency: CurrencyWidget,
	number: NumberWidget,
	cpf: CpfWidget,
	cnpj: CnpjWidget,
	date: DateWidget,
	email: EmailWidget,
	checkbox: CheckboxWidget,
	radio: RadioWidget,
	time: TimeWidget,
	dropdown: DropdownWidget,
	bank: BankWidget,
	address: AddressWidget,
	person: PersonWidget,
	database: DatabaseWidget,
	cnae: CnaeWidget,
	separator: SeparatorWidget,
	structured_list: StructuredListWidget,
}
