import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
// import { prettyDOM } from "@testing-library/dom";
import Blog from "./Blog";

describe("Testing Blog component", () => {

    let testBlog = {
      title: 'The best singer in the world',
      author: 'Rihanna',
      url: 'https://es.wikipedia.org/wiki/Rihanna',
      likes: 99,
      user: {
        username: "mluukkai",
        name: "Matti Luukkai",
        id: '61f7b20465f40c67814368e8'
      },
    }
  let component = null
  const toggleLikes = jest.fn()
  
  beforeEach(() => {
    component = render(<Blog blog={testBlog} toggleLikes={toggleLikes}/>)
  });

  test("5.13: Pruebas de listas de blogs, paso 1 ", () => {

    expect(component.container).toHaveTextContent('The best singer in the world by Rihanna') 

    expect(component.container.user).toBeUndefined()
    expect(component.container.likes).toBeUndefined()

  })

  test("5.14*: Pruebas de lista de blogs, paso 2 ", () => {
    const button = component.container.querySelector("button");
    fireEvent.click(button);

    expect(component.container).toHaveTextContent(testBlog.url)
    expect(component.container).toHaveTextContent(testBlog.likes)

  })

  test("5.15*: Pruebas de lista de blogs, paso 3", () => {
    const viewButton = component.getByText("view");
    fireEvent.click(viewButton)

    component.debug()

    const likeButton = component.getByText("like");
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(toggleLikes.mock.calls).toHaveLength(2);

  })

})