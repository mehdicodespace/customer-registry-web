export class Customer {
  public _uuid: string;
  public firstName: string;
  public lastName: string;
  public dateOfBirth: string;
  public phoneNumber: string;
  public email: string;
  public bankAccountNumber: string;

  constructor({
    _uuid = "",
    firstName = "",
    lastName = "",
    dateOfBirth = "",
    phoneNumber = "",
    email = "",
    bankAccountNumber = "",
  }: Partial<Customer> = {}) {
    this._uuid = _uuid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.bankAccountNumber = bankAccountNumber;
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
