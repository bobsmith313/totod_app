import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToDosAllContext } from "../../Modules/ToDosContext";
import ToDoForm from "../ToDoForm/ToDoForm";
import PageNotFound from "../PageNotFound/PageNotFound";
import ToDoItem from "../ToDoItem/ToDoItem";
import "./ToDos.css";
import { ToDosType } from "../../Modules/ToDosReducer";

const FilterTypes = Object.freeze({
    ALL: 0,
    DONE: 1,
    NOT_DONE: 2,
});

const ToDos = () => {
    const { id } = useParams();
    const listId = Number(id);
    const [search, setSearch] = useState<string>("");
    const [formDisplayed, setFormDisplayed] = useState<boolean>(false);
    const [filterState, setFilterState] = useState<number>(FilterTypes.ALL);
    const { state } = useToDosAllContext();
    const currentTodos: ToDosType | undefined = state.find(
        (t) => t.id === listId
    );

    const changeFilterType = () => {
        setFilterState((filterState + 1) % 3);
    };

    return (
        <main>
            {currentTodos && (
                <>
                    <h2 className="list-header">{currentTodos.name}</h2>
                    {formDisplayed && (
                        <ToDoForm
                            listId={currentTodos.id}
                            setFormDisplayed={setFormDisplayed}
                        />
                    )}

                    <button
                        className="todo-form-button"
                        onClick={() => setFormDisplayed(true)}
                    >
                        OPEN TODO FORM
                    </button>

                    <div className="search-and-filter-todos">
                        <p>Search ToDos: </p>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <p>Filter: </p>
                        <button onClick={changeFilterType}>
                            {filterState === 0
                                ? "ALL"
                                : filterState === 1
                                    ? "DONE"
                                    : "NOT DONE"}
                        </button>
                    </div>

                    <div className="todos-container">
                        {currentTodos.todos
                            .filter((t) => {
                                if (t.text.includes(search) || t.name.includes(search)) {
                                    if (filterState === FilterTypes.ALL) return t;
                                    if (filterState === FilterTypes.DONE) return t.done;
                                    if (filterState === FilterTypes.NOT_DONE) return !t.done;
                                } else return false;
                            })
                            .map((t) => (
                                <ToDoItem key={t.id} listId={currentTodos.id} t={t} />
                            ))}
                    </div>
                </>
            )}
            {!currentTodos && <PageNotFound />}
        </main>
    );
};

export default ToDos;
