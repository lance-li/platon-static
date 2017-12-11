import * as React from 'react'
import { config } from 'modules/helpers/JsConfig'
import { Route } from 'react-router'

import Base from 'modules/base/Base'
import Welcome from 'modules/problem/Welcome'
import { PlanMain } from 'modules/plan/PlanMain'
import StudyLine from 'modules/plan/StudyLine'
import { KnowledgeViewer } from 'modules/practice/knowledge/KnowledgeViewer'
import { Result as WarmUpResult } from 'modules/practice/warmup/Result'
import { Main as Application } from 'modules/practice/application/Main'
import { Challenge as Challenge } from 'modules/practice/challenge/Challenge'
import { Main as Subject } from 'modules/practice/subject/Main'
import { Start } from 'modules/promotion/evalution/Start'
import { Main as Eva } from 'modules/promotion/evalution/Main'
import { Result as EvaResult } from 'modules/promotion/evalution/Result'
import { Submit as SubjectSubmit } from 'modules/practice/subject/Submit'
import { ReplyDiscussMessage } from 'modules/message/ReplyWarmupDiscussMessage'
import { MessageCenter } from 'modules/message/MessageCenter'
import { ReplyKnowledgeDiscussMessage } from 'modules/message/ReplyKnowledgeDiscussMessage'
import { AnalysisNew } from 'modules/practice/warmup/AnalysisNew'
import { Comment as ApplicationComment } from 'modules/practice/application/Comment'
import { Comment as SubjectComment } from 'modules/practice/subject/Comment'
import { KnowledgeReview } from 'modules/practice/knowledge/KnowledgeReview'
import { ReplyCommentMessage } from 'modules/message/ReplyCommentMessage'
import { Customer } from 'modules/customer/Customer'
import Personal from 'modules/customer/Personal'
import PointTip from 'modules/customer/PointTip'
import Profile from 'modules/customer/Profile'
import Account from 'modules/customer/account/Account'
import ProblemGallery from 'modules/customer/ProblemGallery'
import RiseMember from 'modules/customer/RiseMember'
import FeedBack from 'modules/customer/FeedBack'
import UserProtocol from 'modules/customer/UserProtocol'
import MobileBind from 'modules/customer/MobileBind'
import { EventWall } from 'modules/plan/EventWall'
import { Explore } from 'modules/problem/Explore'
import { MoreProblem } from 'modules/problem/MoreProblem'
import BannerArticle from 'modules/problem/BannerArticle'
import ForumBase from './modules/forum/ForumBase'
import Question from './modules/forum/question/Question'
import QuestionAnswer from './modules/forum/question/QuestionAnswer'
import AnswerComment from './modules/forum/question/AnswerComment'
import SubmitQuestionInit from './modules/forum/question/SubmitQuestionInit'
import SubmitQuestionDetail from './modules/forum/question/SubmitQuestionDetail'
import { ImprovementReport } from 'modules/plan/ImprovementReport'
import ProblemIntroduction from 'modules/practice/introduction/ProblemIntroduction'
import ProblemExtension from './modules/practice/extension/ProblemExtension'
import PlanList from 'modules/plan/PlanList'
import WarmUpNew from 'modules/practice/warmup/Warmup'
import ForumQuestion from 'modules/customer/ForumQuestion'
import CardsCollection from './modules/problem/CardsCollection'
import ReplyApplicationComment from './modules/message/ReplyApplicationComment'
import Certificate from './modules/customer/certificate/Main'
import CertificateProfile from './modules/customer/certificate/Personal'
import InterlocutionQuestion from './modules/interlocution/InterlocutionQuestion'
import InterlocutionQuestionSubmit from './modules/interlocution/InterlocutionQuestionSubmit'
import InterlocutionQuanAnswer from './modules/interlocution/InterlocutionQuanAnswer'
import { NickName } from './modules/customer/account/components/NickName'
import { HeadImage } from './modules/customer/account/components/HeadImage'
import PersonalModify from './modules/customer/account/PersonalModify'
import OverView from './modules/schedule/overview/OverView'
import Transfer from './modules/schedule/overview/components/Transfer'
import SchedulePlan from './modules/schedule/plan/SchedulePlan'

import ScheduleNotice from './modules/schedule/ScheduleNotice'
import ScheduleChoice from './modules/schedule/ScheduleChoice'
import CountDown from './modules/schedule/CountDown'
import PrizeCard from './modules/promotion/prizecard/PrizeCard'
import ProblemNoPublish from './modules/schedule/nopublish/ProblemNoPublish'
import BusinessApply from './modules/bsapply/BusinessApply'
import BusinessApplySubmitSuccess from './modules/bsapply/BusinessApplySubmitSuccess'
import BusinessApplyChoice from './modules/bsapply/BusinessApplyChoice'
import { SectionProgressHeader } from './modules/practice/components/SectionProgressHeader'
import StudyReport from './modules/plan/StudyReport'

const routes = (
  <Route>
    <Route path="/rise/static" component={Base}
           onChange={() => {
             config(['chooseWXPay'])
           }}>

      <Route path="welcome" component={Welcome}/>
      <Route path="rise" component={PlanList}/>
      <Route path="camp" component={PlanList}/>

      <Route path="problem/explore" component={Explore}/>
      <Route path="problem/more" component={MoreProblem}/>
      <Route path="problem/package" component={BannerArticle}/>
      <Route path="problem/extension" component={ProblemExtension}/>
      <Route path="problem/cards" component={CardsCollection}/>

      <Route path="learn" component={PlanList}/>
      <Route path="plan/main" component={PlanList}/>
      <Route path="plan/view" component={ProblemIntroduction}/>
      <Route path="plan/study" component={StudyLine}/>
      {/*<Route path="plan/study" component={PlanMain}/>*/}
      <Route path="plan/report" component={ImprovementReport}/>

      <Route path="practice/warmup" component={WarmUpNew}/>
      <Route path="practice/warmup/new/analysis" component={AnalysisNew}/>
      <Route path="practice/warmup/result" component={WarmUpResult}/>
      <Route path="practice/application" component={Application}/>
      <Route path="practice/challenge" component={Challenge}/>
      <Route path="practice/application/comment" component={ApplicationComment}/>
      <Route path="practice/subject" component={Subject}/>
      <Route path="practice/subject/submit" component={SubjectSubmit}/>
      <Route path="practice/subject/comment" component={SubjectComment}/>
      <Route path="practice/knowledge" component={KnowledgeViewer}/>
      <Route path="practice/knowledge/review" component={KnowledgeReview}/>

      <Route path="message/warmup/reply" component={ReplyDiscussMessage}/>
      <Route path="message/subject/reply" component={SubjectComment}/>
      <Route path="message/application/reply" component={ReplyApplicationComment}/>
      <Route path="message/knowledge/reply" component={ReplyKnowledgeDiscussMessage}/>
      <Route path="message/comment/reply" component={ReplyCommentMessage}/>

      <Route path="customer" component={Customer}>
        <Route path="personal" component={Personal}/>
        <Route path="personal/modify" component={PersonalModify}/>
        <Route path="profile" component={Profile}/>
        <Route path="account" component={Account}/>
        <Route path="modify/nickname" component={NickName}/>
        <Route path="modify/headImg" component={HeadImage}/>
        <Route path="point/tip" component={PointTip}/>
        <Route path="problem" component={ProblemGallery}/>
        <Route path="member" component={RiseMember}/>
        <Route path="feedback" component={FeedBack}/>
        <Route path="userprotocol" component={UserProtocol}/>
        <Route path="mobile/check" component={MobileBind}/>
        <Route path="forum/mine" component={ForumQuestion}/>
        <Route path="certificate/profile" component={CertificateProfile}/>
        <Route path="certificate" component={Certificate}/>
      </Route>

      <Route path="message" component={Customer}>
        <Route path="center" component={MessageCenter}/>
      </Route>

      <Route path="event/wall" component={EventWall}/>

      <Route component={ForumBase}>
        <Route path="/rise/static/message/question/answer" component={QuestionAnswer}/>
        <Route path="/rise/static/message/answer/comment" component={AnswerComment}/>
        <Route path="/forum/static/question" component={Question}/>
        <Route path="/forum/static/answer" component={QuestionAnswer}/>
        <Route path="/forum/static/answer/comment" component={AnswerComment}/>
        <Route path="/forum/static/question/init" component={SubmitQuestionInit}/>
        <Route path="/forum/static/question/detail" component={SubmitQuestionDetail}/>
      </Route>

      <Route path="guest/inter/questions" component={InterlocutionQuestion}/>
      <Route path="inter/question/submit" component={InterlocutionQuestionSubmit}/>
      <Route path="guest/inter/quan/answer" component={InterlocutionQuanAnswer}/>

      <Route path="course/schedule/start" component={ScheduleNotice}/>
      <Route path="course/schedule/choice" component={ScheduleChoice}/>
      <Route path="course/schedule/overview" component={OverView}/>
      <Route path="course/schedule/plan" component={SchedulePlan}/>
      <Route path="course/schedule/nopublish" component={ProblemNoPublish}/>

      <Route path="prize" component={PrizeCard}/>
      <Route path="transfer" component={Transfer}/>
      <Route path="business/apply/start" component={BusinessApply}/>
      <Route path="business/count/down" component={CountDown}/>
      <Route path="business/apply/choice" component={BusinessApplyChoice}/>
      <Route path="business/apply/submit/success" component={BusinessApplySubmitSuccess}/>
    </Route>

    <Route path="/test" component={StudyReport}/>
  </Route>
)

export default routes
