(this.webpackJsonpbeats=this.webpackJsonpbeats||[]).push([[405],{197:function(s,e,o){"use strict";o.r(e);var t=o(1),j=o(12),a=o.n(j),n=(o(93),o(71)),r=o(72),i=o(73),l=o(83),_=o(82),c=(o(94),o(633)),p=o(634),d=o(644),g=o(639),u=o(636),k=o(643),m=o(641),h=o(638),b=o(637),f=o(645),v=o(646),y=o(649),x=o(650),w=o(647),O=o(642),S=o(4),E=function(s){Object(l.a)(o,s);var e=Object(_.a)(o);function o(s){var t;Object(r.a)(this,o),(t=e.call(this,s)).onChange=function(s){t.setState(Object(n.a)({},s.target.name,s.target.value)),localStorage.setItem(s.target.name,s.target.value)},t.onExecute=function(s){var e=window.processors_execute(t.state.processors,t.state.logs);if(!e.events)return console.log("Error: ",JSON.stringify(e)),void t.setState({hasError:!0,output:JSON.stringify(e,null,2)});var o=e.events.map((function(s){return s.error?(t.setState({hasError:!0}),s.error):(t.setState({hasError:!1}),s.event)}));t.setState({output:JSON.stringify(o,null,2)})};var j=localStorage.getItem("processors");j||(j="- dissect:\n    tokenizer: '[%{timestamp}]'\n- timestamp:\n    field: dissect.timestamp\n    layouts:\n      - 2006-01-02T15:04:05.999999999Z07:00\n");var a=localStorage.getItem("logs");return a||(a="[2018-12-14T05:35:38.313Z] I santad: action=EXEC|decision=ALLOW|reason=UNKNOWN|sha256=a8defc1b24c45f6dabeb8298af5f8e1daf39e1504e16f878345f15ac94ae96d7|path="),t.state={processors:j,logs:a,output:"",hasError:!1},t}return Object(i.a)(o,[{key:"render",value:function(){return Object(S.jsx)(c.a,{className:"beatsPlaygroundPage",children:Object(S.jsxs)(p.a,{children:[Object(S.jsx)(d.a,{children:Object(S.jsx)(g.a,{children:Object(S.jsx)(u.a,{size:"l",children:Object(S.jsx)("h1",{children:"Beats Playground"})})})}),Object(S.jsx)(k.a,{children:Object(S.jsx)(m.a,{children:Object(S.jsxs)(h.a,{children:[Object(S.jsxs)(b.a,{children:[Object(S.jsx)(f.a,{fullWidth:!0,label:"Beat Processors",helpText:"List of Beats processors.",labelAppend:Object(S.jsx)(v.a,{size:"xs",children:Object(S.jsx)(y.a,{href:"https://www.elastic.co/guide/en/beats/filebeat/current/defining-processors.html#processors",target:"_blank",rel:"noopener noreferrer",children:"Processor Documentation"})}),children:Object(S.jsx)(x.a,{name:"processors",placeholder:"- dissect: ...",value:this.state.processors,isInvalid:this.state.hasError,onChange:this.onChange,fullWidth:!0})}),Object(S.jsx)(f.a,{fullWidth:!0,label:"Sample Log",helpText:"Each log line is processed separately.",children:Object(S.jsx)(x.a,{name:"logs",placeholder:"[2020-02-02 20:20:02] Some log line.",value:this.state.logs,onChange:this.onChange,fullWidth:!0})}),Object(S.jsx)(w.a,{type:"submit",onClick:this.onExecute,fill:!0,children:"Execute"})]}),Object(S.jsx)(b.a,{children:Object(S.jsx)(O.a,{value:this.state.output,fontSize:"m",paddingSize:"m",width:"100%",height:"100%",color:"dark",overflowHeight:300,isCopyable:!0})})]})})})]})})}}]),o}(t.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o(196);a.a.render(Object(S.jsx)(E,{}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(s){s.unregister()})).catch((function(s){console.error(s.message)}))},93:function(s,e,o){},94:function(s,e,o){},98:function(s,e,o){var t={"./accessibility.js":[198,0],"./aggregate.js":[199,1],"./alert.js":[200,2],"./analyze_event.js":[201,3],"./annotation.js":[202,4],"./apm_trace.js":[203,5],"./app_add_data.js":[204,6],"./app_advanced_settings.js":[205,7],"./app_apm.js":[206,8],"./app_app_search.js":[207,9],"./app_auditbeat.js":[208,10],"./app_canvas.js":[209,11],"./app_code.js":[210,12],"./app_console.js":[211,13],"./app_cross_cluster_replication.js":[212,14],"./app_dashboard.js":[213,15],"./app_devtools.js":[214,16],"./app_discover.js":[215,17],"./app_ems.js":[216,18],"./app_filebeat.js":[217,19],"./app_gis.js":[218,20],"./app_graph.js":[219,21],"./app_grok.js":[220,22],"./app_heartbeat.js":[221,23],"./app_index_management.js":[222,24],"./app_index_pattern.js":[223,25],"./app_index_rollup.js":[224,26],"./app_lens.js":[225,27],"./app_logs.js":[226,28],"./app_management.js":[227,29],"./app_metricbeat.js":[228,30],"./app_metrics.js":[229,31],"./app_ml.js":[230,32],"./app_monitoring.js":[231,33],"./app_notebook.js":[232,34],"./app_packetbeat.js":[233,35],"./app_pipeline.js":[234,36],"./app_recently_viewed.js":[235,37],"./app_reporting.js":[236,38],"./app_saved_objects.js":[237,39],"./app_search_profiler.js":[238,40],"./app_security.js":[239,41],"./app_security_analytics.js":[240,42],"./app_spaces.js":[241,43],"./app_sql.js":[242,44],"./app_timelion.js":[243,45],"./app_upgrade_assistant.js":[244,46],"./app_uptime.js":[245,47],"./app_users_roles.js":[246,48],"./app_visualize.js":[247,49],"./app_watches.js":[248,50],"./app_workplace_search.js":[249,51],"./apps.js":[250,52],"./arrow_down.js":[251,53],"./arrow_left.js":[252,54],"./arrow_right.js":[253,55],"./arrow_up.js":[254,56],"./asterisk.js":[255,57],"./beaker.js":[256,58],"./bell.js":[257,59],"./bellSlash.js":[258,60],"./bolt.js":[259,61],"./boxes_horizontal.js":[260,62],"./boxes_vertical.js":[261,63],"./branch.js":[262,64],"./broom.js":[263,65],"./brush.js":[264,66],"./bug.js":[265,67],"./bullseye.js":[266,68],"./calendar.js":[267,69],"./check.js":[268,70],"./checkInCircleFilled.js":[269,71],"./cheer.js":[270,72],"./clock.js":[271,73],"./cloudDrizzle.js":[272,74],"./cloudStormy.js":[273,75],"./cloudSunny.js":[274,76],"./compute.js":[275,77],"./console.js":[276,78],"./controls_horizontal.js":[277,79],"./controls_vertical.js":[278,80],"./copy.js":[279,81],"./copy_clipboard.js":[280,82],"./cross.js":[281,83],"./crossInACircleFilled.js":[282,84],"./crosshairs.js":[283,85],"./currency.js":[284,86],"./cut.js":[285,87],"./database.js":[286,88],"./document.js":[287,89],"./documentEdit.js":[288,90],"./documents.js":[289,91],"./dot.js":[290,92],"./download.js":[291,93],"./editorDistributeHorizontal.js":[292,94],"./editorDistributeVertical.js":[293,95],"./editorItemAlignBottom.js":[294,96],"./editorItemAlignCenter.js":[295,97],"./editorItemAlignLeft.js":[296,98],"./editorItemAlignMiddle.js":[297,99],"./editorItemAlignRight.js":[298,100],"./editorItemAlignTop.js":[299,101],"./editorPositionBottomLeft.js":[300,102],"./editorPositionBottomRight.js":[301,103],"./editorPositionTopLeft.js":[302,104],"./editorPositionTopRight.js":[303,105],"./editor_align_center.js":[304,106],"./editor_align_left.js":[305,107],"./editor_align_right.js":[306,108],"./editor_bold.js":[307,109],"./editor_code_block.js":[308,110],"./editor_comment.js":[309,111],"./editor_heading.js":[310,112],"./editor_italic.js":[311,113],"./editor_link.js":[312,114],"./editor_ordered_list.js":[313,115],"./editor_redo.js":[314,116],"./editor_strike.js":[315,117],"./editor_table.js":[316,118],"./editor_underline.js":[317,119],"./editor_undo.js":[318,120],"./editor_unordered_list.js":[319,121],"./email.js":[320,122],"./empty.js":[25],"./eql.js":[321,123],"./exit.js":[322,124],"./expand.js":[323,125],"./expandMini.js":[324,126],"./export.js":[325,127],"./eye.js":[326,128],"./eye_closed.js":[327,129],"./faceNeutral.js":[328,130],"./face_happy.js":[329,131],"./face_neutral.js":[330,132],"./face_sad.js":[331,133],"./filter.js":[332,134],"./flag.js":[333,135],"./fold.js":[334,136],"./folder_check.js":[335,137],"./folder_closed.js":[336,138],"./folder_exclamation.js":[337,139],"./folder_open.js":[338,140],"./full_screen.js":[339,141],"./gear.js":[340,142],"./glasses.js":[341,143],"./globe.js":[342,144],"./grab.js":[343,145],"./grab_horizontal.js":[344,146],"./grid.js":[345,147],"./heart.js":[346,148],"./heatmap.js":[347,149],"./help.js":[348,150],"./home.js":[349,151],"./iInCircle.js":[350,152],"./image.js":[351,153],"./import.js":[352,154],"./index_close.js":[353,155],"./index_edit.js":[354,156],"./index_flush.js":[355,157],"./index_mapping.js":[356,158],"./index_open.js":[357,159],"./index_settings.js":[358,160],"./inputOutput.js":[359,161],"./inspect.js":[360,162],"./invert.js":[361,163],"./ip.js":[362,164],"./keyboard_shortcut.js":[363,165],"./kql_field.js":[364,166],"./kql_function.js":[365,167],"./kql_operand.js":[366,168],"./kql_selector.js":[367,169],"./kql_value.js":[368,170],"./link.js":[369,171],"./list.js":[370,172],"./list_add.js":[371,173],"./lock.js":[372,174],"./lockOpen.js":[373,175],"./logo_aerospike.js":[374,176],"./logo_apache.js":[375,177],"./logo_app_search.js":[376,178],"./logo_aws.js":[377,179],"./logo_aws_mono.js":[378,180],"./logo_azure.js":[379,181],"./logo_azure_mono.js":[380,182],"./logo_beats.js":[381,183],"./logo_business_analytics.js":[382,184],"./logo_ceph.js":[383,185],"./logo_cloud.js":[384,186],"./logo_cloud_ece.js":[385,187],"./logo_code.js":[386,188],"./logo_codesandbox.js":[387,189],"./logo_couchbase.js":[388,190],"./logo_docker.js":[389,191],"./logo_dropwizard.js":[390,192],"./logo_elastic.js":[391,193],"./logo_elastic_stack.js":[392,194],"./logo_elasticsearch.js":[393,195],"./logo_enterprise_search.js":[394,196],"./logo_etcd.js":[395,197],"./logo_gcp.js":[396,198],"./logo_gcp_mono.js":[397,199],"./logo_github.js":[398,200],"./logo_gmail.js":[399,201],"./logo_golang.js":[400,202],"./logo_google_g.js":[401,203],"./logo_haproxy.js":[402,204],"./logo_ibm.js":[403,205],"./logo_ibm_mono.js":[404,206],"./logo_kafka.js":[405,207],"./logo_kibana.js":[406,208],"./logo_kubernetes.js":[407,209],"./logo_logging.js":[408,210],"./logo_logstash.js":[409,211],"./logo_maps.js":[410,212],"./logo_memcached.js":[411,213],"./logo_metrics.js":[412,214],"./logo_mongodb.js":[413,215],"./logo_mysql.js":[414,216],"./logo_nginx.js":[415,217],"./logo_observability.js":[416,218],"./logo_osquery.js":[417,219],"./logo_php.js":[418,220],"./logo_postgres.js":[419,221],"./logo_prometheus.js":[420,222],"./logo_rabbitmq.js":[421,223],"./logo_redis.js":[422,224],"./logo_security.js":[423,225],"./logo_site_search.js":[424,226],"./logo_sketch.js":[425,227],"./logo_slack.js":[426,228],"./logo_uptime.js":[427,229],"./logo_webhook.js":[428,230],"./logo_windows.js":[429,231],"./logo_workplace_search.js":[430,232],"./logstash_filter.js":[431,233],"./logstash_if.js":[432,234],"./logstash_input.js":[433,235],"./logstash_output.js":[434,236],"./logstash_queue.js":[435,237],"./magnet.js":[436,238],"./magnifyWithMinus.js":[437,239],"./magnifyWithPlus.js":[438,240],"./map_marker.js":[439,241],"./memory.js":[440,242],"./menu.js":[441,243],"./menuDown.js":[442,244],"./menuLeft.js":[443,245],"./menuRight.js":[444,246],"./menuUp.js":[445,247],"./merge.js":[446,248],"./minimize.js":[447,249],"./minus.js":[448,250],"./minus_in_circle.js":[449,251],"./minus_in_circle_filled.js":[450,252],"./ml_classification_job.js":[451,253],"./ml_create_advanced_job.js":[452,254],"./ml_create_multi_metric_job.js":[453,255],"./ml_create_population_job.js":[454,256],"./ml_create_single_metric_job.js":[455,257],"./ml_data_visualizer.js":[456,258],"./ml_outlier_detection_job.js":[457,259],"./ml_regression_job.js":[458,260],"./moon.js":[459,261],"./nested.js":[460,262],"./node.js":[461,263],"./number.js":[462,264],"./offline.js":[463,265],"./online.js":[464,266],"./package.js":[465,267],"./pageSelect.js":[466,268],"./pagesSelect.js":[467,269],"./paint.js":[468,270],"./paper_clip.js":[469,271],"./partial.js":[470,272],"./pause.js":[471,273],"./pencil.js":[472,274],"./pin.js":[473,275],"./pin_filled.js":[474,276],"./play.js":[475,277],"./plus.js":[476,278],"./plus_in_circle.js":[477,279],"./plus_in_circle_filled.js":[478,280],"./popout.js":[479,281],"./push.js":[480,282],"./question_in_circle.js":[481,283],"./quote.js":[482,284],"./refresh.js":[483,285],"./reporter.js":[484,286],"./return_key.js":[485,287],"./save.js":[486,288],"./scale.js":[487,289],"./search.js":[488,290],"./securitySignal.js":[489,291],"./securitySignalDetected.js":[490,292],"./securitySignalResolved.js":[491,293],"./shard.js":[492,294],"./share.js":[493,295],"./snowflake.js":[494,296],"./sortLeft.js":[495,297],"./sortRight.js":[496,298],"./sort_down.js":[497,299],"./sort_up.js":[498,300],"./sortable.js":[499,301],"./starPlusEmpty.js":[500,302],"./starPlusFilled.js":[501,303],"./star_empty.js":[502,304],"./star_empty_space.js":[503,305],"./star_filled.js":[504,306],"./star_filled_space.js":[505,307],"./star_minus_empty.js":[506,308],"./star_minus_filled.js":[507,309],"./stats.js":[508,310],"./stop.js":[509,311],"./stop_filled.js":[510,312],"./stop_slash.js":[511,313],"./storage.js":[512,314],"./string.js":[513,315],"./submodule.js":[514,316],"./swatch_input.js":[515,317],"./symlink.js":[516,318],"./tableOfContents.js":[517,319],"./table_density_compact.js":[518,320],"./table_density_expanded.js":[519,321],"./table_density_normal.js":[520,322],"./tag.js":[521,323],"./tear.js":[522,324],"./temperature.js":[523,325],"./timeline.js":[524,326],"./tokens/tokenAlias.js":[525,327],"./tokens/tokenAnnotation.js":[526,328],"./tokens/tokenArray.js":[527,329],"./tokens/tokenBinary.js":[528,330],"./tokens/tokenBoolean.js":[529,331],"./tokens/tokenClass.js":[530,332],"./tokens/tokenCompletionSuggester.js":[531,333],"./tokens/tokenConstant.js":[532,334],"./tokens/tokenDate.js":[533,335],"./tokens/tokenDenseVector.js":[534,336],"./tokens/tokenElement.js":[535,337],"./tokens/tokenEnum.js":[536,338],"./tokens/tokenEnumMember.js":[537,339],"./tokens/tokenEvent.js":[538,340],"./tokens/tokenException.js":[539,341],"./tokens/tokenField.js":[540,342],"./tokens/tokenFile.js":[541,343],"./tokens/tokenFlattened.js":[542,344],"./tokens/tokenFunction.js":[543,345],"./tokens/tokenGeo.js":[544,346],"./tokens/tokenHistogram.js":[545,347],"./tokens/tokenIP.js":[546,348],"./tokens/tokenInterface.js":[547,349],"./tokens/tokenJoin.js":[548,350],"./tokens/tokenKey.js":[549,351],"./tokens/tokenKeyword.js":[550,352],"./tokens/tokenMethod.js":[551,353],"./tokens/tokenModule.js":[552,354],"./tokens/tokenNamespace.js":[553,355],"./tokens/tokenNested.js":[554,356],"./tokens/tokenNull.js":[555,357],"./tokens/tokenNumber.js":[556,358],"./tokens/tokenObject.js":[557,359],"./tokens/tokenOperator.js":[558,360],"./tokens/tokenPackage.js":[559,361],"./tokens/tokenParameter.js":[560,362],"./tokens/tokenPercolator.js":[561,363],"./tokens/tokenProperty.js":[562,364],"./tokens/tokenRange.js":[563,365],"./tokens/tokenRankFeature.js":[564,366],"./tokens/tokenRankFeatures.js":[565,367],"./tokens/tokenRepo.js":[566,368],"./tokens/tokenSearchType.js":[567,369],"./tokens/tokenShape.js":[568,370],"./tokens/tokenString.js":[569,371],"./tokens/tokenStruct.js":[570,372],"./tokens/tokenSymbol.js":[571,373],"./tokens/tokenText.js":[572,374],"./tokens/tokenTokenCount.js":[573,375],"./tokens/tokenVariable.js":[574,376],"./training.js":[575,377],"./trash.js":[576,378],"./unfold.js":[577,379],"./unlink.js":[578,380],"./user.js":[579,381],"./users.js":[580,382],"./vector.js":[581,383],"./videoPlayer.js":[582,384],"./vis_area.js":[583,385],"./vis_area_stacked.js":[584,386],"./vis_bar_horizontal.js":[585,387],"./vis_bar_horizontal_stacked.js":[586,388],"./vis_bar_vertical.js":[587,389],"./vis_bar_vertical_stacked.js":[588,390],"./vis_gauge.js":[589,391],"./vis_goal.js":[590,392],"./vis_line.js":[591,393],"./vis_map_coordinate.js":[592,394],"./vis_map_region.js":[593,395],"./vis_metric.js":[594,396],"./vis_pie.js":[595,397],"./vis_table.js":[596,398],"./vis_tag_cloud.js":[597,399],"./vis_text.js":[598,400],"./vis_timelion.js":[599,401],"./vis_vega.js":[600,402],"./vis_visual_builder.js":[601,403],"./wrench.js":[602,404]};function j(s){if(!o.o(t,s))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+s+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=t[s],j=e[0];return Promise.all(e.slice(1).map(o.e)).then((function(){return o(j)}))}j.keys=function(){return Object.keys(t)},j.id=98,s.exports=j}},[[197,406,407]]]);
//# sourceMappingURL=main.dff84ef6.chunk.js.map