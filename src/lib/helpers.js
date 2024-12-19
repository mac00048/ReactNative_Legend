
import React from 'react';
import { Text } from 'native-base';

export const display = (value) => {
    if (value) {
        const html = [];
        const lines = value.trim().split("\n");

        let lineBreaks = 0;
        lines.reverse().forEach((line, index) => {
            if (line.trim() === "") {
                lineBreaks += 1;
            } else {
                if (index == 0) {
                    html.push(<Text key={index}>{line}</Text>);
                } else {
                    html.push(<Text key={index} style={{ marginBottom: 20 * lineBreaks }}>{line}</Text>);
                }
                lineBreaks = 0;
            }
        });

        return html.reverse();
    } else {
        return <Text>N/A</Text>;
    }
};
