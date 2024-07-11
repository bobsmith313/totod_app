import { ReactElement, createContext, useCallback, useContext, useEffect, useReducer } from "react";
import AxiosBase, { errorHandling } from "./AxiosBase";
import { AxiosError } from "axios";
import { createNewItem, createNewToDosList, initState, reducer, ReducerActionsTypes, ToDosType } from "./ToDosReducer";

//Internal Custom Hook that returns state and all functions provided by ToDosContext 
const useToDosContext = (initState: ToDosType[]) => {
    const [state, dispatch] = useReducer(reducer, initState);

    const replaceAll = useCallback((wholeList: ToDosType[]) => dispatch({ type: ReducerActionsTypes.REPLACE_ALL, payload: { wholeList } }), []);

    const addNewList = useCallback((name: string, state: ToDosType[]) => {
        const asyncAddNewList = async () => {
            try {
                const response = await AxiosBase.post(`/todos`, createNewToDosList(name ?? "", state));
                const responseData: ToDosType = response.data;
                dispatch({ type: ReducerActionsTypes.ADD_NEW_TODOS_LIST, payload: { toDosList: responseData } });
            }
            catch (error) {
                errorHandling(error as AxiosError);
            }
        }
        asyncAddNewList();
    }, []);

    const deleteList = useCallback((id: number) => {
        const asyncDeleteList = async () => {
            try {
                const response = await AxiosBase.delete(`/todos/${id}`);
                const responseData: ToDosType = response.data;
                dispatch({ type: ReducerActionsTypes.DELETE_TODOS_LIST, payload: { id: responseData.id } });
            }
            catch (error) {
                errorHandling(error as AxiosError);
            }
        }
        asyncDeleteList();
    }, []);

    const addNewItem = useCallback((id: number, name: string, text: string, dueDate: Date, state: ToDosType[]) => {
        const asyncAddNewItem = async () => {
            try {
                const listItemIndex: number = state.findIndex(t => t.id === id);
                const listItem: ToDosType = { ...state[listItemIndex], todos: [...state[listItemIndex].todos] };
                const newItem: ToDosType = { ...listItem, todos: [...listItem.todos, createNewItem(id, name, text, dueDate, state)] };

                const response = await AxiosBase.put(`/todos/${id}`, newItem);
                const responseData: ToDosType = response.data;
                dispatch({ type: ReducerActionsTypes.ADD_NEW_ITEM, payload: { toDosList: responseData } });
            }
            catch (error) {
                errorHandling(error as AxiosError);
            }
        }
        asyncAddNewItem();

    }, []);

    const deleteItem = useCallback((listId: number, itemId: number, state: ToDosType[]) => {
        const asyncDeleteList = async () => {
            try {
                const listItemIndex: number = state.findIndex(t => t.id === listId);
                const listItem: ToDosType = { ...state[listItemIndex], todos: [...state[listItemIndex].todos] };
                const newItem: ToDosType = { ...listItem, todos: [...listItem.todos.filter(l => l.id !== itemId)] };

                const response = await AxiosBase.put(`/todos/${listId}`, newItem);
                const responseData: ToDosType = response.data;
                dispatch({ type: ReducerActionsTypes.DELETE_ITEM, payload: { toDosList: responseData } });
            }
            catch (error) {
                errorHandling(error as AxiosError);
            }
        }
        asyncDeleteList();

    }, []);

    const toggleItemDone = useCallback((listId: number, itemId: number, state: ToDosType[]) => {
        const asyncToggleList = async () => {
            try {
                const listItemIndex: number = state.findIndex(t => t.id === listId)
                const listItem: ToDosType = { ...state[listItemIndex], todos: [...state[listItemIndex].todos] };
                const newItem: ToDosType = { ...listItem, todos: [...listItem.todos.map(l => l.id === itemId ? { ...l, done: !l.done } : l)] };

                const response = await AxiosBase.put(`/todos/${listId}`, newItem);
                const responseData: ToDosType = response.data;
                dispatch({ type: ReducerActionsTypes.TOGGLE_ITEM_DONE, payload: { toDosList: responseData } })
            }
            catch (error) {
                errorHandling(error as AxiosError);
            }
        }
        asyncToggleList();
    }, []);

    return { state, addNewList, deleteList, addNewItem, deleteItem, toggleItemDone, replaceAll };
}

type UseToDosContextType = ReturnType<typeof useToDosContext>;

const initToDosState: UseToDosContextType = {
    state: initState,
    replaceAll: (wholeList: ToDosType[]) => { },
    addNewList: (name: string) => { },
    deleteList: (id: number) => { },
    addNewItem: (id: number, name: string, text: string, dueDate: Date) => { },
    deleteItem: (listId: number, itemId: number) => { },
    toggleItemDone: (listId: number, itemId: number) => { }
}

const ToDosContext = createContext<UseToDosContextType>(initToDosState);

type ChildrenType = {
    children?: ReactElement | ReactElement[] | undefined,
}

const ConnectionComponent = ({ children }: ChildrenType) => {
    const { replaceAll } = useToDosAllContext();

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const response = await AxiosBase.get("/todos");
                replaceAll(response.data);
            }
            catch (error) {
                errorHandling(error as AxiosError);
            }
        }
        getInitialData();
    }, []);

    return (
        <>
            {children}
        </>
    )
}

export const ToDosProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <ToDosContext.Provider value={useToDosContext(initState)}>
            <ConnectionComponent>
                {children}
            </ConnectionComponent>
        </ToDosContext.Provider>
    )
}


// Custom Hook imported and used by Components
export const useToDosAllContext = (): UseToDosContextType => {
    return useContext(ToDosContext);
}