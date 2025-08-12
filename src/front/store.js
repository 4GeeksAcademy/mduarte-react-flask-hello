export const initialStore=()=>{
  return{
    message: null,
    isAuth: false,
  }
}

export default function storeReducer(store, action = {}) {
  console.log("DEBUG dispatch →", action);
  switch(action.type){
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

     case 'LOGIN':

      return {
        ...store,
        isAuth: true
      };

    case 'LOGOUT':

      return {
        ...store,
        isAuth: false
      };

    case "set_hello":
    return {
        ...store,
        message: action.payload
    };
    default:
      throw Error('Unknown action.');
  }    
}

