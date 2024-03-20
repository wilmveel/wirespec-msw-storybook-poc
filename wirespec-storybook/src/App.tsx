import React, {useEffect, useState} from "react"
import {addTodo, getAllTodos, toggleTodos} from "./client";
import {Todo, TodoInput} from "../../gen/Todo";

type TodoItemProps = {
    item: Todo,
    onDone: (id: string) => () => void
    onRemove: (id: string) => () => void
}

const TodoItem = ({item, onRemove, onDone}: TodoItemProps) => {
    return <div className="flex mb-4 items-center">
        <p className="w-full text-grey-darkest">{item.name}</p>
        <button
            onClick={onDone(item.id)}
            className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green border-green hover:bg-green">{item.done ? "Done" : "Not Done"}
        </button>
        <button onClick={onRemove(item.id)}
                className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red">Remove
        </button>
    </div>
}


export const App = () => {

    const [todos, setTodos] = useState<Todo[]>([])

    useEffect(() => {
        loadTodos()
    }, [])

    const handleAdd = () => {
        console.log("Add")
        const input:TodoInput = {
            name:"adfadfadfadfadsf",
            description: "asdfafadfadfasdf",
            location:{
                street: "adsfadf",
                city: "adsfadfadf",
                postalCode: "adf",
                country: "NL"
            }
        }
        addTodo(input).then(_ => loadTodos())
    }

    const handleDone = (id: string) => () => {
        console.log(id)
        toggleTodos(id, false).then(_ => loadTodos())
    }

    const handleRemove = (id: string) => () => {
        console.log(id)
    }

    const loadTodos = () => getAllTodos()
        .then(todos => {
            console.log(todos)
            setTodos(todos.content.body)
        })
        .catch(e => {
            console.log(e)
            setTodos([])
        })

    return <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
        <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
            <div className="mb-4">
                <h1 className="text-grey-darkest">Todo List</h1>
                <div className="flex mt-4">
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                           placeholder="Add Todo"/>
                    <button
                        onClick={handleAdd}
                        className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal">Add
                    </button>
                </div>
            </div>
            <div>
                {todos.map(it => <TodoItem key={it.id} item={it} onDone={handleDone} onRemove={handleRemove}></TodoItem>)}
            </div>
        </div>
    </div>
}