/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes definition of ContentItemComponent.
 * @see http://jsfiddle.net/ssorallen/XX8mw/
 *
 * @author Young Suk Ahn Park
 * @date 4/13/15
 */
var React = require('react/addons');
//var $ = require('jquery');

var internals = {};

class ContentItemComponent extends React.Component
{
    render ()
    {
        var contentItem = this.props.item.item;

        var domainCodeStyle = {
            marginRight: '0.2em'
        };

        // For the submenu target name generation
        //var objUuid = contentItem.uuid;
        var objUuid = (Math.floor((Math.random() * 1000) + 1)).toString();

        return (
            <div>
                <span style={domainCodeStyle}>[{contentItem.metadata.learningArea.domainCode}]</span>
                <span><a href={this.props.siteBaseUrl + "/content-edit.html#item/"+contentItem.uuid}>{contentItem.metadata.title}</a></span>
                    <ul className="eli-item-actions">
                        <li title="bookmark"><i className={this.props.iconBookmark}></i></li>
                        <li title="edit"><i className={this.props.iconEdit}></i></li>
                        <li title="copy"><i className={this.props.iconCopy}></i></li>
                        <li title="add" >
                            <a href="#" className="dropdown-button" data-activates={"add-submenu" + objUuid}><i className={this.props.iconAdd}></i></a>
                            <ul id={"add-submenu" + objUuid} className="dropdown-content" >
                                <li title="add before"><a href={"content-edit.html#item/_new_/" + this.props.parent.uuid}>Before</a></li>
                                <li title="add after"><a href={"content-edit.html#item/_new_/" + this.props.parent.uuid}>After</a></li>
                            </ul>
                        </li>
                    </ul>
            </div>
        )
    }
};
ContentItemComponent.defaultProps = {
    iconBookmark: 'mdi-action-bookmark',
    iconEdit: 'mdi-content-create',
    iconCopy: 'mdi-content-content-copy',
    iconAdd: 'mdi-content-add'
};


export class ContentTreeComponent extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {visible: true};
    }

    /***** React Lifecycle *****/

    componentDidMount()
    {
        // @todo - insteadn of using selector, obtain the dom object directly from React
        //var el = this.getDOMNode();

        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false // Displays dropdown below the button
            }
        );
    }

    render()
    {
        var childNodes;
        var classObj;

        var currNode = this.props.node;
        if (currNode.body.subnodes != null) {
            childNodes = currNode.body.subnodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <ContentTreeComponent node={node} siteBaseUrl={this.props.siteBaseUrl} />
                    </li>
                )
            }.bind(this));

            classObj = {
                togglable: true,
                "togglable-down": this.state.visible,
                "togglable-up": !this.state.visible
            };
        }

        if (currNode.body.items != null &&
            currNode.body.items.length > 0) {
            childNodes = currNode.body.items.map(function(item, index) {
                return <li key={index} ><ContentItemComponent parent={currNode} item={item} siteBaseUrl={this.props.siteBaseUrl} /></li>
            }.bind(this));

            classObj = {
                togglable: true,
                "togglable-down": this.state.visible,
                "togglable-up": !this.state.visible
            };
        }

        var style;
        if (!this.state.visible) {
            style = {display: "none"};
        }

        // For the submenu target name generation
        //var objUuid = this.props.node.uuid;
        var objUuid = (Math.floor((Math.random() * 1000) + 1)).toString();

        if (!currNode.parentUuid) {
            // Root node is not contractable
            return (
                <div>
                    <span >
                    [{currNode.uuid}] {currNode.metadata.title} (Root)
                    </span>
                    <ul style={style} className="hierarchical" >
                        {childNodes}
                    </ul>
                </div>
            );
        } else {
            // Inner nodes are contractable
            return (
                <div>
                    <span onClick={this.toggle_.bind(this)} className={React.addons.classSet(classObj)}>
                    [{currNode.uuid}] {currNode.metadata.title} ({currNode.kind})
                    </span>
                    <ul className="eli-item-actions">
                        <li title="bookmark"><i className={this.props.iconBookmark}></i></li>
                        <li title="edit"><i className={this.props.iconEdit}></i></li>
                        <li title="copy"><i className={this.props.iconCopy}></i></li>
                        <li title="add" >
                            <a href="#" className="dropdown-button" data-activates={"add-submenu" + objUuid}><i className={this.props.iconAdd}></i></a>
                            <ul id={"add-submenu" + objUuid} className="dropdown-content" >
                                <li title="add before"><a href={"#node/_new_/" + currNode.parentUuid}>Before</a></li>
                                <li title="add after"><a href={"#node/_new_/" + currNode.parentUuid}>After</a></li>
                            </ul>
                        </li>
                    </ul>

                    <ul style={style} className="hierarchical" >
                        {childNodes}
                    </ul>
                </div>
            );
        }

    }

    /**
     * Toggles the expand/contract of the hierarchical tree node elements
     * @private
     */
    toggle_()
    {
        this.setState({visible: !this.state.visible});
    }

};

ContentTreeComponent.defaultProps = {
    iconBookmark: 'mdi-action-bookmark',
    iconEdit: 'mdi-content-create',
    iconCopy: 'mdi-content-content-copy',
    iconAdd: 'mdi-content-add'
};
