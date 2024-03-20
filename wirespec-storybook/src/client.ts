import {CreateTodo, GetAllTodo, TodoInput, ToggleTodoById, Wirespec} from "../../gen/Todo";

export const getAllTodos = () => {
    const req = GetAllTodo.requestUndefined()
    return handle<GetAllTodo.Response>(req)
}

export const addTodo = (todo: TodoInput) => {
    const req = CreateTodo.requestApplicationJson({body: todo})
    return handle<CreateTodo.Response>(req)
}

export const toggleTodos = (id: string, done: boolean) => {
    const req = ToggleTodoById.requestApplicationJson({id, body: done})
    return handle<ToggleTodoById.Response>(req)
}

const handle: <Res extends Wirespec.Response<any>>(request: Wirespec.Request<any>) => Promise<Res> = (request) => {

    const queryString = request.query
        ? Object.entries(request.query)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        : ""
    const url = queryString ? `${request.path}?${queryString}` : request.path
    const opts = {
        method: request.method,
        body: request?.content != undefined ? JSON.stringify(request.content.body) : undefined
    }

    return fetch(url, opts)
        .then(async (res) => {
            const body = await res.json()
            const response: Wirespec.Response<any> = {
                status: res.status,
                content: {
                    type: "application/json",
                    body
                }
            }
            return response as Promise<Res>
        })
        .catch(error => {
            throw error.response.data;
        });
};
