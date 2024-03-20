refined PersonId /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g
refined UserId /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g
refined EventId /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g

refined FullName /^.{1,255}$/g

refined Street /^.{1,50}$/g
refined City /^.{1,50}$/g
refined PostalCode /^\d{4}[ ]?[A-Z]{2}$/g
refined Country /^.{1,50}$/g

refined Email /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/g

enum Gender {
    MALE,
    FEMALE,
    UNKNOWN
}

type Person {
    id: PersonId,
    name: FullName,
    biography: String
}

type PersonDetail {
    id: PersonId,
    name: FullName,
    biography: String,
    age: Integer,
    gender: Gender,
    adres: Adres,
    user: User
}

type Adres {
    street: Street,
    city: City,
    postalCode: PostalCode,
    country: Country
}

type User {
    id: UserId,
    email: Email,
    state: UserState
}

enum UserState {
    A,B
}

type Event {
    id: EventId,
    name: String,
    description: String,
    location: Adres,
    atendees: Person[]
}

endpoint EventsAll GET /events -> {
    200 ->  Event[]
}

endpoint EventsById GET /events/{id:EventId} -> {
    200 ->  Event
}

endpoint EventsById GET /persons -> {
    200 ->  Person[]
}

endpoint EventsById GET /persons/{id:PersonId} -> {
    200 ->  PersonDetail
}
