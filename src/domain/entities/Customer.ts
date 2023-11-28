import { ref, Ref } from 'vue';
export class Customer {
  public firstName: Ref<string>;
  public lastName: Ref<string>;
  public dateOfBirth: Ref<Date>;
  public phoneNumber: Ref<string>;
  public email: Ref<string>;
  public bankAccountNumber: Ref<string>;

  constructor({
    firstName = '',
    lastName = '',
    dateOfBirth = new Date(),
    phoneNumber = '',
    email = '',
    bankAccountNumber = '',
  }: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    phoneNumber: string;
    email: string;
    bankAccountNumber: string;
  }) {
    this.firstName = ref(firstName);
    this.lastName = ref(lastName);
    this.dateOfBirth = ref(dateOfBirth);
    this.phoneNumber = ref(phoneNumber);
    this.email = ref(email);
    this.bankAccountNumber = ref(bankAccountNumber);
  }
}