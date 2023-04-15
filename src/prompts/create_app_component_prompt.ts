import { IPrompts, aiPrompts } from ".";

const createAppComponentPrompt = [
  { role: 'system', content: 'As .' },
  {
    role: 'user', content: `Decompress "Compressed Types"; review the decompressed Typescript type set; design a TSX React Functional Component primarily focusing on the Component Description resulting in a TSX code block; incorporate the optional decompressed types where applicable:
  
  Compressed Types: U2Iκ⇒V|N)↔(κ:I)⇒V?I:N.VdNΔV:T.RmNΔK]:T[K].ApiEvt{rId,mth,url,🔓,uSub,srcIp,usrGrpRoles,pp,qp,Tbody}.ApiP{evt,db,lggr,rd,rdP,kcl,cmpl,tx}.AuthP{evt&{body:AuthB},db,rd,rdP,kcl,cmpl,tx}.IWh{prop}↔(AuthP)⇒P<void>.AuthB{id,cId,rId,ip,ssId,uId,tm,typ,det}.DbErr{schm,tbl,clmn,dType,cnstrnt}.ApiErRsp{prop}:uknw,rId.ApiIntEr{rsp{st:num},data{emsg}}.PrxKy{aSub,apClnt,grpRlAct,grpAdRls,apRls,rlCall}.RdPrx{args}⇒P<PrxKy>.IAsst{id,prompt,promptR}.KcSO{regroup}.StrUsr{sub}.ITrMsg{wrds,dur,ts,unm}.IBookTr{unm,msg}.IBooking{qId,qSub,trns}.ICont{id,nm,eml,phn}.ScRspMsgAttr{sdp,ice,fmt,prop}:str.Sndr{prRsp}.IExch{booking}.IFdbck{id,msg,grpNm,crOn,unm}.IFileTp{id,nm}.IFile{id,ftId,ftNm,nm,loc}.IField{l}.IFormTpl=Rec<IField[]>.IFormSubm=Rec<str[]>.IFormVrSnSubm{fVId,subm}.IFormVr{id,fId,fTpl,subm,crOn,crSub}.IForm{id,nm,vr,crOn,crSub}.IGrpForm{id,grpId,fId,grpNm}.IGrpRole{grpId,rlId,extId}.IGrpSchedDateSlot{ws,stT,sDate,schBrSlotId,hr,mn,tm}.IGrpSched{mstr,grpId,schId,grpNm}.IGrpSvcAdn{grpId}.IGrpSvc{grpId,grpNm,svcId,ids}.IGrpUsrSchedStubRepl{unm,slotD,stT,schBrSlotId,sTId,grpNm,qId}.IGrpUsrSchedStub{grpSchId,usrSchId,qId,slotD,stT,svcNm,tierNm,repl}.IGrpUsrSched{id,grpSchId,usrSchId,svcs,grpNm}.IGrpUsr{grpId,usrId,usrSub,extId,grpExtId,rlId,rlNm,grpNm}.IGrpUsrs=Rec<IGrpUsr>.IGrpRlAuthAct{act{id?,nm}}.IGrpRlActState{asgnmnts}.IGrp{id,extId,crSub,crOn,defRlId,alwdDmns,nm,prps,cde,usrCnt,rls,usrs,avGrpAsgnmnts,valid,ndChkNm,chkNm,chckedNm,err}.ILkp{id,nm}.IManageGrps=Rec<IGrp>.

  Component Description: \${prompt1}
  
  Instructions:
  1. Decompress "Compresed Types" to get the list of application-types, which may or may not be related to the description.
  2. Do not include "Compressed Types" or the results of its decompression in the component.
  3. When a type is required in a component, infer type name and attribute names as full-length titleized or camel-case English names of their compressed versions (e.g., IGroupUsers, groupAssignmentUsers). 
  4. Application-types are not required to be used in the component, but feel free to use them liberally if needed.
  5. If an application-type is required in the component import it like ISampleType, from 'awayto/core'.
  6. Use these nodejs pacakges if needed: @date-io/dayjs, @mui/icons-material, @mui/material, @mui/material-next, @mui/x-data-grid, @mui/x-date-pickers, @react-keycloak/web, @reduxjs/toolkit, dayjs, history, keycloak-js, react, react-dom, react-dropzone, react-redux, react-router, react-router-dom, react-window, uuid.
  7. Use Reduxjs/toolkit auto generated react hooks with the "sh" variable; import sh from 'awayto/hooks' then use sh in the component, for example
    - const { data } = sh.useTypeQuery()
    - const [postType] = sh.usePostTypeMutation()
  8. Utilize Material-UI components for all design related aspects.
  9. Export the component as the default export and reply strictly only with the TSX surrounded in a code block.`}
];

Object.assign(aiPrompts, { [IPrompts.CREATE_APP_COMPONENT]: createAppComponentPrompt })