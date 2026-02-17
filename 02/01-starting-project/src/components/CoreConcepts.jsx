export default function CoreConcepts(props) {
    return (<li>
        <img src={props.image} alt={props.alt} />
        <h3>{props.title}</h3>
        <p>{props.description}</p>

    </li>)
}