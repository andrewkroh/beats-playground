import React, {Component} from 'react';
import axios from 'axios';
import pako from 'pako';
import './App.css';

import {
    EuiButton,
    EuiCodeEditor,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiGlobalToastList,
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
    EuiToolTip,
} from '@elastic/eui';

const defaultProcessors = `- dissect:
    tokenizer: '[%{timestamp}]'
- timestamp:
    field: dissect.timestamp
    layouts:
      - 2006-01-02T15:04:05.999999999Z07:00
`;

const defaultLogs = '[2018-12-14T05:35:38.313Z] I santad: action=EXEC|decision=ALLOW|reason=UNKNOWN|sha256=a8defc1b24c45f6dabeb8298af5f8e1daf39e1504e16f878345f15ac94ae96d7|path=';

function getQueryVariable(input, variable) {
    var query = input.substring(input.indexOf("?")+1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

function getLoadProcessors() {
    return getQueryVariable(window.location.hash, "load_processors");
}

function getLoadLogs() {
    return getQueryVariable(window.location.hash, "load_logs");
}

const MAX_URL_LENGTH = 60000;

function encodeShareState(processors, logs) {
    const payload = JSON.stringify({ p: processors, l: logs });
    const compressed = pako.gzip(payload);
    // Convert to base64, then make URL-safe
    const base64 = btoa(String.fromCharCode.apply(null, compressed));
    return encodeURIComponent(base64);
}

function decodeShareState(encoded) {
    try {
        const base64 = decodeURIComponent(encoded);
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const decompressed = pako.ungzip(bytes, { to: 'string' });
        const parsed = JSON.parse(decompressed);
        if (typeof parsed.p !== 'string' || typeof parsed.l !== 'string') return null;
        return { processors: parsed.p, logs: parsed.l };
    } catch (e) {
        console.error('Failed to decode share state:', e);
        return null;
    }
}

function getShareParam() {
    const hash = window.location.hash;
    if (hash.startsWith('#s=')) {
        return hash.substring(3);
    }
    return null;
}

export default class BeatsPlayground extends Component {
    constructor(props) {
        super(props);

        let savedProcessors = localStorage.getItem('processors');
        if (!savedProcessors) {
            savedProcessors = defaultProcessors;
        }

        let savedLogs = localStorage.getItem('logs');
        if (!savedLogs) {
            savedLogs = defaultLogs;
        }

        this.state = {
            processors: savedProcessors,
            logs: savedLogs,
            output: '',
            hasError: false,
            toasts: [],
        };
    }

    componentDidMount() {
        this.handleHashChange()
        window.addEventListener("hashchange", this.handleHashChange, false);
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.handleHashChange, false);
    }

    handleHashChange = () => {
        // Check for share parameter first
        const shareParam = getShareParam();
        if (shareParam) {
            const decoded = decodeShareState(shareParam);
            if (decoded) {
                this.setState({
                    processors: decoded.processors,
                    logs: decoded.logs,
                    hasError: false,
                    output: '',
                });
            } else {
                this.addToast({
                    title: 'Invalid share link',
                    color: 'danger',
                    text: 'The share link appears to be corrupted.',
                });
            }
            return; // Skip load_processors/load_logs handling
        }

        const loadProcessorsUrl = getLoadProcessors();
        if (loadProcessorsUrl) {
            const request = {
                url: loadProcessorsUrl,
                responseType: 'text',
                transformResponse: [],
                method: 'get'
            };

            axios(request)
                .then(res => {
                    this.setState({
                        processors: res.data,
                    });
                })
                .catch(error => {
                    this.setState({
                        hasError: true,
                        output: error.response.data
                    });
                });
        }

        const loadLogsUrl = getLoadLogs();
        if (loadLogsUrl) {
            const request = {
                url: loadLogsUrl,
                responseType: 'text',
                transformResponse: [],
                method: 'get'
            };

            axios(request)
                .then(res => {
                    this.setState({
                        logs: res.data,
                    });
                })
                .catch(error => {
                    this.setState({
                        hasError: true,
                        output: error.response.data
                    });
                });
        }
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
        localStorage.setItem(e.target.name, e.target.value)
    };

    onExecute = (e) => {
        let res = window.processors_execute(this.state.processors, this.state.logs);

        if (!res.events) {
            console.log("Error: ", JSON.stringify(res))
            this.setState({
                hasError: true,
                output: JSON.stringify(res, null, 2)
            });
            return;
        }

        const events = res.events.map(x => {
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
    };

    addToast = (toast) => {
        const id = Date.now().toString();
        this.setState((prev) => ({ toasts: [...prev.toasts, { id, ...toast }] }));
    };

    removeToast = (removedToast) => {
        this.setState((prev) => ({
            toasts: prev.toasts.filter((t) => t.id !== removedToast.id),
        }));
    };

    onShare = async () => {
        const encoded = encodeShareState(this.state.processors, this.state.logs);
        const shareUrl = `${window.location.origin}${window.location.pathname}#s=${encoded}`;

        if (shareUrl.length > MAX_URL_LENGTH) {
            this.addToast({
                title: 'URL may be too long',
                color: 'warning',
                text: `URL is ${shareUrl.length} chars. Some browsers may truncate long URLs.`,
            });
        }

        window.history.replaceState(null, '', `#s=${encoded}`);

        try {
            await navigator.clipboard.writeText(shareUrl);
            this.addToast({
                title: 'Link copied!',
                color: 'success',
                text: 'Share URL copied to clipboard.',
            });
        } catch (err) {
            this.addToast({
                title: 'URL updated',
                color: 'primary',
                text: 'Copy the URL from the address bar to share.',
            });
        }
    };

    render() {
        return (
            <EuiPage className="beatsPlaygroundPage">
                <EuiPageBody>
                    <EuiPageHeader>
                        <EuiPageHeaderSection>
                            <EuiTitle size="l">
                                <EuiLink href="https://github.com/andrewkroh/beats-playground" target="_blank" external={false}><h1>Beats Playground</h1></EuiLink>
                            </EuiTitle>
                        </EuiPageHeaderSection>
                        <EuiPageHeaderSection>
                            <EuiToolTip
                                position="bottom"
                                content="Creates a shareable URL. Note: Processors and logs will be stored in the URL (unencrypted)."
                            >
                                <EuiButton
                                    iconType="share"
                                    onClick={this.onShare}
                                >
                                    Share
                                </EuiButton>
                            </EuiToolTip>
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
                <EuiGlobalToastList
                    toasts={this.state.toasts}
                    dismissToast={this.removeToast}
                    toastLifeTimeMs={6000}
                />
            </EuiPage>
        );
    }
}

