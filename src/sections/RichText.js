import React from 'react';
import {Dimensions, Linking} from 'react-native';
import {RenderHTML} from 'react-native-render-html';

const width = Dimensions.get('window').width;

const tagsStyles = {
  p: {marginTop: 0, marginBottom: 16, lineHeight: 21, color: '#000000'},
  del: {textDecorationLine: 'line-through', color: '#000000'},
  h1: {
    fontSize: 16 * 2,
    marginTop: 16 * 2 * 0.335,
    marginBottom: 16 * 2 * 0.335,
    fontWeight: 'bold',
    color: '#000000',
  },
  h2: {
    fontSize: 16 * 1.5,
    marginTop: 16 * 1.5 * 0.415,
    marginBottom: 16 * 1.5 * 0.415,
    fontWeight: 'bold',
    color: '#000000',
  },
  h3: {
    fontSize: 16 * 1.17,
    marginTop: 16 * 1.17 * 0.5,
    marginBottom: 16 * 1.17 * 0.5,
    fontWeight: 'bold',
    color: '#000000',
  },
  li: {
    color: '#000000'
  }
};

const renderersProps = {
  a: {
    onPress(event, url, htmlAttribs, target) {
      Linking.openURL(url);
    },
  },
};

class RichText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const html = this.props.html;
    const cleanedHtml = html.replace(/> +</g, '>&shy; <');

    if (!cleanedHtml) {
      return null;
    }

    return (
      <RenderHTML
        source={{html: cleanedHtml || '<p></p>'}}
        baseFontStyle={{fontSize: 16}}
        enableExperimentalMarginCollapsing={true}
        contentWidth={width}
        tagsStyles={tagsStyles}
        renderersProps={renderersProps}
      />
    );
  }
}

export default RichText;
