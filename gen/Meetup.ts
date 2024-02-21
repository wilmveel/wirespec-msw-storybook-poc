export type PersonId = string;
const regExpPersonId = RegExp('^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$');
export const validatePersonId = (value: string): value is PersonId => 
  regExpPersonId.test(value);

export type UserId = string;
const regExpUserId = RegExp('^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$');
export const validateUserId = (value: string): value is UserId => 
  regExpUserId.test(value);

export type EventId = string;
const regExpEventId = RegExp('^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$');
export const validateEventId = (value: string): value is EventId => 
  regExpEventId.test(value);

export type FullName = string;
const regExpFullName = RegExp('^.{1,255}$');
export const validateFullName = (value: string): value is FullName => 
  regExpFullName.test(value);

export type Street = string;
const regExpStreet = RegExp('^.{1,255}$');
export const validateStreet = (value: string): value is Street => 
  regExpStreet.test(value);

export type City = string;
const regExpCity = RegExp('^.{1,255}$');
export const validateCity = (value: string): value is City => 
  regExpCity.test(value);

export type PostalCode = string;
const regExpPostalCode = RegExp('^\\d{4}[ ]?[A-Z]{2}$');
export const validatePostalCode = (value: string): value is PostalCode => 
  regExpPostalCode.test(value);

export type Country = string;
const regExpCountry = RegExp('^.{1,255}$');
export const validateCountry = (value: string): value is Country => 
  regExpCountry.test(value);

export type Email = string;
const regExpEmail = RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
export const validateEmail = (value: string): value is Email => 
  regExpEmail.test(value);

export type Gender = "MALE" | "FEMALE" | "UNKNOWN"

export type Person = {
  "id": PersonId,
  "name": FullName,
  "age": number,
  "gender": Gender,
  "adres": Adres,
  "user": User
}


export type Adres = {
  "street": Street,
  "city": City,
  "postalCode": PostalCode,
  "country": Country
}


export type User = {
  "id": UserId,
  "email": Email
}


export type Event = {
  "id": EventId,
  "name": string,
  "description": string,
  "adres": Adres
}

