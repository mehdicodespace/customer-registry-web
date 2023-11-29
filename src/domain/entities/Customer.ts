import { ref, Ref } from "vue";
export class Customer {
  public _uuid: Ref<string>;
  public firstName: Ref<string>;
  public lastName: Ref<string>;
  public dateOfBirth: Ref<string>;
  public phoneNumber: Ref<string>;
  public email: Ref<string>;
  public bankAccountNumber: Ref<string>;

  constructor({
    _uuid = "",
    firstName = "",
    lastName = "",
    dateOfBirth = "",
    phoneNumber = "",
    email = "",
    bankAccountNumber = "",
  }: {
    _uuid: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    bankAccountNumber: string;
  }) {
    this._uuid = ref(_uuid);
    this.firstName = ref(firstName);
    this.lastName = ref(lastName);
    this.dateOfBirth = ref(dateOfBirth);
    this.phoneNumber = ref(phoneNumber);
    this.email = ref(email);
    this.bankAccountNumber = ref(bankAccountNumber);
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
