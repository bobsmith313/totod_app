import { useToDosAllContext } from "../../Modules/ToDosContext";
import { ToDoType } from "../../Modules/ToDosReducer";
import "./ToDoItem.css";

type PropsType = {
    t: ToDoType,
    listId: number
}

const ToDoItem = ({ t, listId }: PropsType) => {
    const { state, deleteItem, toggleItemDone } = useToDosAllContext();

    const overDueDate: boolean = (new Date()).getTime() > (new Date(t.dueDate.toString()).getTime());
    const dateClass: string = overDueDate ? "red" : "";
    const doneClass: string = t.done ? "todo-item-done" : "";

    return (
        <div className={"todo-item " + doneClass}>
            <h3>{t.name}</h3>
            <p className={"todo-item-time " + dateClass}><time dateTime={t.dueDate.toString()}>{t.dueDate.toString().slice(0, 10)} {t.dueDate.toString().slice(11, 16)}</time></p>
            <hr />
            <p className="todo-item-text">{t.text}</p>
            <hr />
            <button className="delete-button" onClick={() => deleteItem(listId, t.id, state)}>DELETE</button>
            <button className="done-button" onClick={() => toggleItemDone(listId, t.id, state)}>{t.done ? "DONE" : "NOT DONE"}</button>
        </div>
    )
}

export default ToDoItem