import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

import {
    EuiButton,
    EuiCodeEditor,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiLink,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiText,
    EuiTextArea,
    EuiTitle,
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
            hasError: false,
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
                        this.setState({ hasError: true })
                        return x.error;
                    }
                    this.setState({ hasError: false })
                    return x.event;
                });
                this.setState({
                    output: JSON.stringify(events, null, 2)
                });
            })
            .catch(error => {
                this.setState({
                    hasError: true,
                    output: error.response.data
                });
            });
    };

    render() {
        return (
            <EuiPage className="beatsPlaygroundPage">
                <EuiPageBody>
                    <EuiPageHeader>
                        <EuiPageHeaderSection>
                            <EuiTitle size="l">
                                <h1>Beats Playground</h1>
                            </EuiTitle>
                        </EuiPageHeaderSection>
                    </EuiPageHeader>

                    <EuiPageContent>
                            <EuiPageContentBody>

                                <EuiFlexGroup>
                                    <EuiFlexItem>

                                        <EuiFormRow
                                            fullWidth
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
                                                isInvalid={this.state.hasError}
                                                onChange={this.onChange}
                                                fullWidth
                                            />
                                        </EuiFormRow>

                                        <EuiFormRow
                                            fullWidth
                                            label="Sample Log"
                                            helpText="Each log line is processed separately.">
                                            <EuiTextArea
                                                name="logs"
                                                placeholder="[2020-02-02 20:20:02] Some log line."
                                                value={this.state.logs}
                                                onChange={this.onChange}
                                                fullWidth
                                            />
                                        </EuiFormRow>

                                        <EuiButton type="submit"
                                                   onClick={this.onExecute}
                                                   fill>
                                            Execute
                                        </EuiButton>
                                    </EuiFlexItem>

                                    <EuiFlexItem>
                                        <EuiCodeEditor
                                            value={this.state.output}
                                            fontSize="m"
                                            paddingSize="m"
                                            width="100%"
                                            height="100%"
                                            color="dark"
                                            overflowHeight={300}
                                            isCopyable>
                                        </EuiCodeEditor>
                                    </EuiFlexItem>
                                </EuiFlexGroup>


                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        );
    }
}

