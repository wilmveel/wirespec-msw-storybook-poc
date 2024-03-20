refined UUID /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g

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
    id: UUID,
    name: FullName,
    biography: String
}

type PersonDetail {
    id: UUID,
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
    id: UUID,
    email: Email,
    state: UserState
}

enum UserState {
    ON, OFF
}

type Todo {
    id: UUID,
    name: String,
    description: String,
    done: Boolean,
    test:String,
    person: Person
}

type TodoInput {
    name: String,
    description: String,
    location: Adres
}

endpoint GetAllTodo GET /todos -> {
    200 ->  Todo[]
}

endpoint GetTodoById GET /todos/{id:UUID} -> {
    200 ->  Todo
}

endpoint ToggleTodoById POST Boolean /todos/{id:UUID}/toggle -> {
    200 ->  Todo
}

endpoint CreateTodo POST TodoInput /todos -> {
    200 ->  Todo
}

endpoint UpdateTodo PUT Todo /todos/{id:UUID} -> {
    200 ->  Todo
}

endpoint PersonsAll GET /persons -> {
    200 ->  Person[]
}

endpoint PersonsById GET /persons/{id:UUID} -> {
    200 ->  PersonDetail
}
