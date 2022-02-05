import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";

//Pruebas en ejecución (npm test)
describe("Jest -- Testing BlogForm component", () => {

    test("5.16*: Pruebas de lista de blogs, paso 4", () => {
    const createBlogHandler = jest.fn()

    const component = render(<BlogForm createBlog={createBlogHandler} />)

    const titleInput = component.container.querySelector("#title")
    const authorInput = component.container.querySelector("#author")
    const urlInput = component.container.querySelector("#url")
    const form = component.container.querySelector("form")

    fireEvent.change(titleInput, {
        target: { value: "probando aplicaciones react" },
    })
    fireEvent.change(authorInput, {
        target: { value: "Matti" },
    })
    fireEvent.change(urlInput, {
        target: { value: "https://fullstackopen.com/es/part5/probando_aplicaciones_react" },
    })
    fireEvent.submit(form)

    expect(createBlogHandler.mock.calls).toHaveLength(1)
    expect(createBlogHandler.mock.calls[0][0].title).toBe("probando aplicaciones react")
    expect(createBlogHandler.mock.calls[0][0].author).toBe("Matti")
    expect(createBlogHandler.mock.calls[0][0].url).toBe("https://fullstackopen.com/es/part5/probando_aplicaciones_react")
    })
})