import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToDosAllContext } from '../../Modules/ToDosContext';
import "./ToDoForm.css";

const schema = z.object({
    text: z.string().max(1000, { message: "Note can't be longer than 1000 characters." }).min(3, { message: "Note can't be shorter than 3 characters." }),
    label: z.string().max(20, { message: "Label can't be longer than 20 characters." }).min(3, { message: "Label can't be shorter than 3 characters." }),
    dueDate: z.string().pipe(z.coerce.date())
});

type FormType = z.infer<typeof schema>;

type PropsType = {
    listId: number,
    setFormDisplayed: React.Dispatch<React.SetStateAction<boolean>>
}

const ToDoForm = ({ listId, setFormDisplayed }: PropsType) => {
    const { state, addNewItem } = useToDosAllContext();

    const defaultTime: Date = (new Date((new Date().getTime() + 60000 * 60 * 24 * 2))).toISOString().split(".")[0].slice(0, -3) as unknown as Date;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormType>({
        defaultValues: {
            label: "Go to work",
            text: "work",
            dueDate: defaultTime
        },
        resolver: zodResolver(schema),
    });


    useEffect(() => {
        reset({
            label: "",
            text: "",
            dueDate: defaultTime
        })
    }, [isSubmitSuccessful]);

    const hideForm = () => {
        setFormDisplayed(false);
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        addNewItem(listId, data.label, data.text, new Date(data.dueDate), state);
        hideForm();
    }

    return (
        <section className="form-section">
            <form className="todo-form" onSubmit={handleSubmit(onSubmit)}>
                <h3>ToDo Form</h3>
                <button type="button" className="cancel-button" onClick={() => hideForm()}>X</button>
                <label htmlFor="label">Label:</label>
                <input {...register("label")} type="text" name="label" />
                <label htmlFor="dueDate">Due Date:</label>
                <input {...register("dueDate")} type="datetime-local" name="dueDate" />
                <label htmlFor="text">Note:</label>
                <textarea {...register("text")} name="text" rows={5}></textarea>
                {errors.label &&
                    <p className="red">{errors.label.message}</p>
                }
                {errors.dueDate &&
                    <p className="red">{errors.dueDate.message}</p>
                }
                {errors.text &&
                    <p className="red">{errors.text.message}</p>
                }
                <div className="todo-form-buttons-div">
                    <button type="button" disabled={isSubmitting} onClick={() => hideForm()}>CANCEL</button>
                    <button type="submit" className="submit-button" disabled={isSubmitting}>ADD NEW TODO</button>
                </div>
            </form>
        </section>
    )
}

export default ToDoForm