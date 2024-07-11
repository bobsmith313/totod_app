import { useEffect } from "react"
import { Link } from "react-router-dom"
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToDosAllContext } from "../../Modules/ToDosContext";
import { zodResolver } from "@hookform/resolvers/zod";
import "./HomePage.css";

const schema = z.object({
    name: z.string().max(30, { message: "List Name can't be longer than 30 characters." }).min(3, { message: "List Name can't be shorter than 3 characters." })
});

type FormType = z.infer<typeof schema>;

const HompePage = () => {

    const { state, deleteList, addNewList } = useToDosAllContext();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormType>({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        reset({
            name: "",
        })
    }, [isSubmitSuccessful]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        addNewList(data.name, state);
    }

    return (
        <main>
            <section className="todo-lists-form-section">
                <form className="todo-lists-form" onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="name">List Name:</label>
                    <input {...register("name")} type="text" name="name" />
                    <button type="submit" disabled={isSubmitting}>Create List</button>
                </form>
                {
                    errors.name &&
                    <p className="red">{errors.name.message}</p>
                }
            </section>
            <div className="todos-lists-container">
                {
                    state.map(l => {
                        return <div key={l.id}><Link to={`/todos/${l.id}`}>{l.name}</Link>
                            <button className="delete-button" onClick={() => deleteList(l.id)}>DELETE</button>
                        </div>
                    })
                }
            </div>
        </main>
    )
}

export default HompePage