import Aux from '../../../hoc/Auxiliary';
import classes from './Input.module.css';

const input = props => {
    let inputElement = null;
    switch(props.elementType){
        case "input":
            inputElement = (
                <input className={classes.InputText} onChange={props.onChange} value={props.value} {...props.elementConfig}/>
            );
            break;
        case "textarea":
            inputElement = (
                <textarea onChange={props.onChange} defaultValue={props.value} {...props.elementConfig}/>
            );
            break;
        case "radio":
                inputElement = (
                    <div onChange={props.onChange} className={classes.RadioBtn}>
                        {
                            props.elementConfig.options.map(obj => {
                                return (
                                <Aux key={obj.value}>
                                <input type="radio" name={props.elementConfig.name} id={obj.displayValue} defaultChecked={obj.checked} value={obj.value}/> 
                                <label htmlFor={obj.displayValue}>{obj.displayValue}</label>
                                </Aux>);
                            })
                        }
                    </div>
                );
            break;
        default:
            inputElement = (
                <input className="InputText" onChange={props.onChange} value={props.value} {...props.elementConfig}/>
            );
    }

    return inputElement;
}

export default input;