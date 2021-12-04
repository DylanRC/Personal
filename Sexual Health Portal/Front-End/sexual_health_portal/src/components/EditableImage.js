import { useLocation } from 'react-router-dom'

// Usage: <EditableImage id=thing_id class=class_name></EditableImage>

export default class EditableImage extends React.Component {

    id = null;
    class_name = null;
    
    style = "";
    url = "";
    alt = "";

    componentDidMount() {
        // Get the element and ID from props
        id = this.props.id;
        class_name = this.props.class;

        // Get the page
        var page = useLocation().pathname;

        // Call the API
        fetch(process.env.API_URL + "/cms/" + page)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
        );
        
        // Load the first config for this element
        url = this.state.items[0].data;
        alt = this.state.items[0].attributes;
        style = this.state.items[0].style;

    }

    render() {

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            // Render the element
            return (
                <img src={this.url} id={this.id} style={this.style} class={this.class} alt={this.alt}></img>
            );
        }
    }
}
