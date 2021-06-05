import './Backdrop.css';

const backdrop = props => {
    return (
        props.visibility ? <div onClick={props.clicked} className='Backdrop'></div> : null
    )
}

export default backdrop;