import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';


// Usage: <EditableText element=h1 id=thing_id class_name=class_name></EditableText>

// The main editable text object
export default class EditableText extends React.Component {

    // Edit mode active
    edit_mode = true;
    sent_edit = false;
    editing = false;

    // Element data
    id = null;
    class_name = null;

    // Content
    style = "";
    text = "";

    // The response data
    loaded = false;
    error = null;

    // Init
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false
        };

        if (localStorage.getItem("authentication") !== "admin") {
            return;
        }

        // Event handlers
        this.handleHover = this.handleHover.bind(this);
        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => this.setState({ editorState });
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);

        // Set the state
        this.state = { editorState: EditorState.createEmpty() };

        // Set the block type and inline style handlers
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }

    // Handle shortcut keys (e.g. Ctrl + B)
    _handleKeyCommand(command) {
        const { editorState } = this.state;

        // Update the state accordingly
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    // Handle tab
    _onTab(e) {
        const maxDepth = 4;

        // Pass the parcle to the RichUtils with a max number of tabs
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    // Handle block type changes by passing to RichUtils
    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    // Handle inline style changes by passing to RichUtils
    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    // Handle hovering over the component
    // When it's hovered, the edit controls should be shown
    // When it's un-hovered, the edit controls should be hidden and the changes
    // should be updated in the database
    handleHover() {

        if (localStorage.getItem("authentication") !== "admin") {
            return;
        }

        // Toggle state
        this.setState(prevState => ({
            isHovered: !prevState.isHovered
        }));

        // If we left hover, update the database
        if (this.state.isHovered && !this.sent_edit) {

            this.sent_edit = true;
            this.editing = false;

            // Get the page
            var page = window.location.pathname;
            this.id = `${this.props.id}`;

            // Get the HTML data from the RichEditor
            var data = stateToHTML(this.state.editorState.getCurrentContent());

            // Form a JSON request
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: data })
            };

            // Send the API request accordingly
            fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT + "/cms" + page + "/" + this.id, requestOptions)
                .then(response => response.json())
                .then(this.text = data)
            
        // If we entered hover, update the state and show the edit controls
        } else {
            this.sent_edit = false;

            this.setState({ editorState: EditorState.createWithContent(stateFromHTML(this.text)) });
            this.editing = true;
        }
    }

    // When initially loaded, load the data from the DB
    loadData() {

        // Get the class and ID from props
        this.id = `${this.props.id}`;
        this.class_name = `${this.props.class_name}`;

        // Get the page
        var page = window.location.pathname;

        // Call the API and request the page and ID contents
        fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT +"/cms" + page + "/" + this.id)
            .then(res => res.json())
            .then(
                (result) => {

                    // Update state with the result
                    this.setState({
                        items: result.items
                    });
                    if (this.state == null) return;

                    // Load the first config for this element
                    this.text = this.state.items[0].data;
                    this.attributes = this.state.items[0].attributes;
                    this.style = this.state.items[0].style;
                    this.loaded = true;

                    const editorState = stateFromHTML(this.text);
                    this.state = { editorState: editorState };
                },

                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.error = error;
                }
        );
    }

    // Render the rich text element
    render() {

        // If not loaded, load the data
        if (!this.loaded) this.loadData();

        // Handle errors and loading status
        if (this.error) {
            return <div>Error: {this.error.message}</div>;
        } else if (!this.loaded) {
            return <div>Loading...</div>;

        // The data was loaded correctly, display it
        } else {

            if (this.editing && (localStorage.getItem("authentication") === "admin")) {
                
                const { editorState } = this.state;

                // If the user changes block type before entering any text, we can
                // either style the placeholder or hide it. Let's just hide it now.
                let className = 'RichEditor-editor';
                var contentState = editorState.getCurrentContent();
                if (!contentState.hasText()) {
                    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                        className += ' RichEditor-hidePlaceholder';
                    }
                }

                // Render the HTML components
                return (
                    <div className="RichEditor-root" onMouseLeave={this.handleHover}>
                        <BlockStyleControls
                            editorState={editorState}
                            onToggle={this.toggleBlockType}
                        />
                        <InlineStyleControls
                            editorState={editorState}
                            onToggle={this.toggleInlineStyle}
                        />
                        <div className={className} onClick={this.focus}>
                            <Editor
                                blockStyleFn={getBlockStyle}
                                customStyleMap={styleMap}
                                editorState={editorState}
                                handleKeyCommand={this.handleKeyCommand}
                                onChange={this.onChange}
                                onTab={this.onTab}
                                ref="editor"
                                placeholder="Type here..."
                                spellCheck={true}
                            />
                        </div>
                    </div>
                );
            }

            // this.editing = false
            else {
                // Render the element without edit controls
                return (
                    <div id={this.id} dangerouslySetInnerHTML={{ __html: this.text }} onMouseEnter={this.handleHover}></div>
                );
            }
        }
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

// Gets the current bkock style
function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

// An object to represnt a button in the controls bar for controlling the style
class StyleButton extends React.Component {
   
    // Run the appropiate functionality depending on the button pressed
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    // Render it with active status
    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

// The block type options
const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];

// An object to represent an object option button
const BlockStyleControls = (props) => {

    // Get the current block and types in the selection
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (

        // For each block type, create a "StyleButton"
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

// The insline style options
var INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

// An obect to represent an inline style option button
const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (

        // For each style option, create a "StyleButton"
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};