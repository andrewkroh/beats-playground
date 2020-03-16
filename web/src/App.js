import React, {Component} from 'react';
import axios from 'axios';
// import './App.css';

import {
    EuiForm,
    EuiFormRow,
    EuiText,
    EuiLink,
    EuiTextArea,
    EuiButton,
    EuiSpacer,
    EuiCodeEditor,
} from '@elastic/eui';

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            processors: `- dissect:
    tokenizer: '[%{timestamp}]'
- timestamp:
    field: dissect.timestamp
    layouts:
      - 2006-01-02T15:04:05.999999999Z07:00
`,
            logs: '[2018-12-14T05:35:38.313Z] I santad: action=EXEC|decision=ALLOW|reason=UNKNOWN|sha256=a8defc1b24c45f6dabeb8298af5f8e1daf39e1504e16f878345f15ac94ae96d7|path=/Applications/Google Chrome.app/Contents/Versions/70.0.3538.110/Google Chrome Helper.app/Contents/MacOS/Google Chrome Helper|args=/Applications/Google Chrome.app/Contents/Versions/70.0.3538.110/Google Chrome Helper.app/Contents/MacOS/Google Chrome Helper --type=utility --field-trial-handle=120122713615061869,9401617251746517350,131072 --lang=en-US --service-sandbox-type=utility --service-request-channel-token=10458143409865682077 --seatbelt-client=262|cert_sha256=345a8e098bd04794aaeefda8c9ef56a0bf3d3706d67d35bc0e23f11bb3bffce5|cert_cn=Developer ID Application: Google, Inc. (EQHXZ8M8AV)|pid=89238|ppid=704|uid=501|user=akroh|gid=20|group=staff|mode=M',
            output: '',
        };
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    onExecute = (e) => {
        const url = '/api/execute';
        const request = {
            url: url,
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            data: { processors: this.state.processors, events: this.state.logs } };
        axios(request)
            .then(res => {
                const events = res.data.events.map(x => {
                    if (x.error) {
                        return x.error;
                    }
                    return x.event;
                });
                this.setState({
                    output: JSON.stringify(events)
                });
            });
    };

    render() {
        return (
            <div>
                <EuiForm>

                    <EuiFormRow
                        label="Beat Processors"
                        helpText="List of Beats processors."
                        labelAppend={
                            <EuiText size="xs">
                                <EuiLink
                                    href="https://www.elastic.co/guide/en/beats/filebeat/current/defining-processors.html#processors"
                                    target="_blank" rel="noopener noreferrer">Processor
                                    Documentation</EuiLink>
                            </EuiText>
                        }>
                        <EuiTextArea
                            name="processors"
                            placeholder="- dissect: ..."
                            value={this.state.processors}
                            onChange={this.onChange}
                        />
                    </EuiFormRow>

                    <EuiFormRow label="Sample Log"
                                helpText="Each log line is processed separately.">
                        <EuiTextArea
                            name="logs"
                            placeholder="[2020-02-02 20:20:02] Some log line."
                            value={this.state.logs}
                            onChange={this.onChange}
                        />
                    </EuiFormRow>

                    <EuiSpacer/>

                    <EuiButton type="submit"
                               onClick={this.onExecute}
                               fill>
                        Execute
                    </EuiButton>
                </EuiForm>

                <EuiCodeEditor
                    value={this.state.output}
                    fontSize="m"
                    paddingSize="m"
                    color="dark"
                    overflowHeight={300}
                    isCopyable>
                </EuiCodeEditor>
            </div>
        );
    }
}

