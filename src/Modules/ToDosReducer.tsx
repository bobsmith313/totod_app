export type ToDoType = {
    id: number,
    name: string,
    text: string,
    dueDate: Date,
    done: boolean
}

export type ToDosType = {
    id: number,
    name: string,
    todos: ToDoType[]
}

export const initState: ToDosType[] = [];

export enum ReducerActionsTypes {
    REPLACE_ALL,
    ADD_NEW_TODOS_LIST,
    DELETE_TODOS_LIST,
    ADD_NEW_ITEM,
    DELETE_ITEM,
    TOGGLE_ITEM_DONE
}

type ReducerAction = {
    type: ReducerActionsTypes,
    payload: {
        wholeList?: ToDosType[],
        toDosList?: ToDosType,
        id?: number
    }
}

export const createNewToDosList = (name: string, state: ToDosType[]): ToDosType => {
    const id: number = state.length === 0 ? 0 : state[state.length - 1].id + 1;
    return { id, name, todos: [] };
}

export const createNewItem = (listId: number, name: string, text: string, dueDate: Date, state: ToDosType[]): ToDoType => {
    const currList: ToDosType = state.find(l => l.id === listId) as ToDosType;
    const currTodos: ToDoType[] = currList.todos;
    const id: number = currTodos.length === 0 ? 0 : currTodos[currTodos.length - 1].id + 1;
    return { id, name, text, dueDate, done: false }
}

const parseIDsToNumbers = (action: ReducerAction): ReducerAction => {
    if (action.payload.id) action.payload.id = Number(action.payload.id);
    if (action.payload.toDosList) action.payload.toDosList.id = Number(action.payload.toDosList.id);
    if (action.payload.wholeList) action.payload.wholeList = action.payload.wholeList.map(l => { return { ...l, id: Number(l.id) } });
    return action;
}

export const reducer = (state: ToDosType[], action: ReducerAction): ToDosType[] => {
    //Because mockAPI sends IDs as strings i parsed them to numbers
    action = parseIDsToNumbers(action);

    switch (action.type) {
        case ReducerActionsTypes.REPLACE_ALL: {
            return [...action.payload.wholeList as ToDosType[]]
        }
        case ReducerActionsTypes.ADD_NEW_TODOS_LIST: {
            return [...state, action.payload.toDosList as ToDosType];
        }
        case ReducerActionsTypes.DELETE_TODOS_LIST: {
            return [...state.filter(todoList => todoList.id !== action.payload.id)];
        }
        case ReducerActionsTypes.ADD_NEW_ITEM: {
            return [...state.filter(l => l.id !== action.payload.toDosList?.id), action.payload.toDosList as ToDosType];
        }
        case ReducerActionsTypes.DELETE_ITEM: {
            return [...state.filter(l => l.id !== action.payload.toDosList?.id), action.payload.toDosList as ToDosType];
        }
        case ReducerActionsTypes.TOGGLE_ITEM_DONE: {
            return [...state.filter(l => l.id !== action.payload.toDosList?.id), action.payload.toDosList as ToDosType];
        }
        default:
            throw new Error();
    }
}