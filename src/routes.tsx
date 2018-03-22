import * as React from 'react'
import { config } from './modules/helpers/JsConfig'
import { Route } from 'react-router'

import Base from './modules/base/Base'
import Loading from './Loading'
import Loadable from 'react-loadable'

const PlanList = Loadable({
  loader: () => import('./modules/plan/PlanList'),
  loading: Loading,
})
const Explore = Loadable({
  loader: () => import('./modules/problem/Explore'),
  loading: Loading,
})
const MoreProblem = Loadable({
  loader: () => import('./modules/problem/MoreProblem'),
  loading: Loading,
})
const BannerArticle = Loadable({
  loader: () => import('./modules/problem/BannerArticle'),
  loading: Loading,
})
const ProblemExtension = Loadable({
  loader: () => import('./modules/practice/extension/ProblemExtension'),
  loading: Loading,
})
const CardsCollection = Loadable({
  loader: () => import('./modules/problem/CardsCollection'),
  loading: Loading,
})
const ProblemIntroduction = Loadable({
  loader: () => import('./modules/practice/introduction/ProblemIntroduction'),
  loading: Loading,
})
const StudyLine = Loadable({
  loader: () => import('./modules/plan/StudyLine'),
  loading: Loading,
})
const ImprovementReport = Loadable({
  loader: () => import('./modules/plan/ImprovementReport'),
  loading: Loading,
})
const WarmUpNew = Loadable({
  loader: () => import('./modules/practice/warmup/Warmup'),
  loading: Loading,
})
const AnalysisNew = Loadable({
  loader: () => import('./modules/practice/warmup/AnalysisNew'),
  loading: Loading,
})
const Application = Loadable({
  loader: () => import('./modules/practice/application/Application'),
  loading: Loading,
})
const Challenge = Loadable({
  loader: () => import('./modules/practice/challenge/Challenge'),
  loading: Loading,
})
const ApplicationComment = Loadable({
  loader: () => import('./modules/practice/application/Comment'),
  loading: Loading,
})
const Subject = Loadable({
  loader: () => import('./modules/practice/subject/Subject'),
  loading: Loading,
})
const KnowledgeViewer = Loadable({
  loader: () => import('./modules/practice/knowledge/KnowledgeViewer'),
  loading: Loading,
})
const KnowledgeReview = Loadable({
  loader: () => import('./modules/practice/knowledge/KnowledgeReview'),
  loading: Loading,
})
const ReplyDiscussMessage = Loadable({
  loader: () => import('./modules/message/ReplyWarmupDiscussMessage'),
  loading: Loading,
})
const ReplyApplicationComment = Loadable({
  loader: () => import('./modules/message/ReplyApplicationComment'),
  loading: Loading,
})
const ReplyKnowledgeDiscussMessage = Loadable({
  loader: () => import('./modules/message/ReplyKnowledgeDiscussMessage'),
  loading: Loading,
})
const ReplyCommentMessage = Loadable({
  loader: () => import('./modules/message/ReplyCommentMessage'),
  loading: Loading,
})
const SendCard = Loadable({
  loader: () => import('./modules/customer/card/experience/SendCard'),
  loading: Loading,
})
const Customer = Loadable({
  loader: () => import('./modules/customer/Customer'),
  loading: Loading,
})
const Personal = Loadable({
  loader: () => import('./modules/customer/Personal'),
  loading: Loading,
})
const PersonalModify = Loadable({
  loader: () => import('./modules/customer/account/PersonalModify'),
  loading: Loading,
})
const Coupon = Loadable({
  loader: () => import('./modules/customer/Coupon'),
  loading: Loading,
})
const Profile = Loadable({
  loader: () => import('./modules/customer/Profile'),
  loading: Loading,
})
const Account = Loadable({
  loader: () => import('./modules/customer/account/Account'),
  loading: Loading,
})
const NickName = Loadable({
  loader: () => import('./modules/customer/account/components/NickName'),
  loading: Loading,
})
const HeadImage = Loadable({
  loader: () => import('./modules/customer/account/components/HeadImage'),
  loading: Loading,
})
const PointTip = Loadable({
  loader: () => import('./modules/customer/PointTip'),
  loading: Loading,
})
const ProblemGallery = Loadable({
  loader: () => import('./modules/customer/ProblemGallery'),
  loading: Loading,
})
const RiseMember = Loadable({
  loader: () => import('./modules/customer/RiseMember'),
  loading: Loading,
})
const FeedBack = Loadable({
  loader: () => import('./modules/customer/FeedBack'),
  loading: Loading,
})
const UserProtocol = Loadable({
  loader: () => import('./modules/customer/UserProtocol'),
  loading: Loading,
})
const MobileBind = Loadable({
  loader: () => import('./modules/customer/MobileBind'),
  loading: Loading,
})
const ForumQuestion = Loadable({
  loader: () => import('./modules/customer/ForumQuestion'),
  loading: Loading,
})
const CertificateProfile = Loadable({
  loader: () => import('./modules/customer/certificate/Personal'),
  loading: Loading,
})
const Certificate = Loadable({
  loader: () => import('./modules/customer/certificate/Main'),
  loading: Loading,
})
const MineCard = Loadable({
  loader: () => import('./modules/customer/card/MineCard'),
  loading: Loading,
})
const MessageCenter = Loadable({
  loader: () => import('./modules/message/MessageCenter'),
  loading: Loading,
})
const EventWall = Loadable({
  loader: () => import('./modules/plan/EventWall'),
  loading: Loading,
})
const ForumBase = Loadable({
  loader: () => import('./modules/forum/ForumBase'),
  loading: Loading,
})
const QuestionAnswer = Loadable({
  loader: () => import('./modules/forum/question/QuestionAnswer'),
  loading: Loading,
})
const AnswerComment = Loadable({
  loader: () => import('./modules/forum/question/AnswerComment'),
  loading: Loading,
})
const Question = Loadable({
  loader: () => import('./modules/forum/question/Question'),
  loading: Loading,
})
const SubmitQuestionInit = Loadable({
  loader: () => import('./modules/forum/question/SubmitQuestionInit'),
  loading: Loading,
})
const SubmitQuestionDetail = Loadable({
  loader: () => import('./modules/forum/question/SubmitQuestionDetail'),
  loading: Loading,
})
const InterlocutionQuestion = Loadable({
  loader: () => import('./modules/interlocution/InterlocutionQuestion'),
  loading: Loading,
})
const InterlocutionQuestionSubmit = Loadable({
  loader: () => import('./modules/interlocution/InterlocutionQuestionSubmit'),
  loading: Loading,
})
const InterlocutionQuanAnswer = Loadable({
  loader: () => import('./modules/interlocution/InterlocutionQuanAnswer'),
  loading: Loading,
})
const ScheduleNotice = Loadable({
  loader: () => import('./modules/schedule/ScheduleNotice'),
  loading: Loading,
})
const ScheduleChoice = Loadable({
  loader: () => import('./modules/schedule/ScheduleChoice'),
  loading: Loading,
})
const OverView = Loadable({
  loader: () => import('./modules/schedule/overview/OverView'),
  loading: Loading,
})
const SchedulePlan = Loadable({
  loader: () => import('./modules/schedule/plan/SchedulePlan'),
  loading: Loading,
})
const ProblemNoPublish = Loadable({
  loader: () => import('./modules/schedule/nopublish/ProblemNoPublish'),
  loading: Loading,
})
const Transfer = Loadable({
  loader: () => import('./modules/schedule/overview/components/Transfer'),
  loading: Loading,
})
const CountDown = Loadable({
  loader: () => import('./modules/schedule/CountDown'),
  loading: Loading,
})
const CampCountDown = Loadable({
  loader: () => import('./modules/schedule/CampCountDown'),
  loading: Loading,
})
const GroupPromotionCountDown = Loadable({
  loader: () => import('./modules/promotion/grouplearning/GroupPromotionCountDown'),
  loading: Loading,
})
const AnnualSummary = Loadable({
  loader: () => import('./modules/promotion/annualsummary/AnnualSummary'),
  loading: Loading,
})
const SelfEvaluate = Loadable({
  loader: () => import('./modules/evaluation/self/SelfEvaluate'),
  loading: Loading,
})
const OtherEvaluate = Loadable({
  loader: () => import('./modules/evaluation/other/OtherEvaluate'),
  loading: Loading,
})
const ProblemCardList = Loadable({
  loader: () => import('./modules/customer/knowledgecards/ProblemCardList'),
  loading: Loading,
})
const RichTextView = Loadable({
  loader: () => import('./modules/other/richtext/RichTextView'),
  loading: Loading,
})
const VideoCourse = Loadable({
  loader: () => import('./modules/video/VideoCourse'),
  loading: Loading,
})

const routes = (
  <Route>
    <Route path="/rise/static" component={Base} onChange={(before, after) => {
      config([ 'chooseWXPay' ])
      if(after.location.state && after.location.state.pageScrollY) {
        setTimeout(() => {
          window.scrollTo(0, after.location.state.pageScrollY)
        }, 1000)
      } else {
        window.scrollTo(0, 0)
      }
    }}>
      <Route path="rise" component={SchedulePlan}/>
      <Route path="camp" component={SchedulePlan}/>
      <Route path="learn" component={SchedulePlan}/>
      {/*<Route path="plan/main" component={SchedulePlan}/>*/}

      <Route path="problem/explore" component={Explore}/>
      <Route path="problem/more" component={MoreProblem}/>
      <Route path="problem/package" component={BannerArticle}/>
      <Route path="problem/extension" component={ProblemExtension}/>
      <Route path="problem/cards" component={CardsCollection}/>

      <Route path="plan/view" component={ProblemIntroduction}/>
      <Route path="plan/study" component={StudyLine}/>
      <Route path="plan/report" component={ImprovementReport}/>

      <Route path="practice/warmup" component={WarmUpNew}/>
      <Route path="practice/warmup/new/analysis" component={AnalysisNew}/>
      <Route path="practice/application" component={Application}/>
      <Route path="practice/challenge" component={Challenge}/>
      <Route path="practice/application/comment" component={ApplicationComment}/>
      <Route path="practice/subject/comment" component={Subject}/>
      <Route path="practice/knowledge" component={KnowledgeViewer}/>
      <Route path="practice/knowledge/review" component={KnowledgeReview}/>

      <Route path="message/warmup/reply" component={ReplyDiscussMessage}/>
      <Route path="message/subject/reply" component={Subject}/>
      <Route path="message/application/reply" component={ReplyApplicationComment}/>
      <Route path="message/knowledge/reply" component={ReplyKnowledgeDiscussMessage}/>
      <Route path="message/comment/reply" component={ReplyCommentMessage}/>
      <Route path="guest/card/send" component={SendCard}/>

      <Route path="article" component={RichTextView}/>

      <Route path="customer" component={Customer}>
        <Route path="personal" component={Personal}/>
        <Route path="personal/modify" component={PersonalModify}/>
        <Route path="coupon" component={Coupon}/>
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
        <Route path="prize/card/list" component={MineCard}/>
        <Route path="knowledge/card/list" component={ProblemCardList}/>
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

      <Route path="transfer" component={Transfer}/>
      <Route path="business/count/down" component={CountDown}/>
      <Route path="camp/count/down" component={CampCountDown}/>
      {/*/!*团队学习倒计时页面*!/*/}
      <Route path="group/promotion/count/down" component={GroupPromotionCountDown}/>
      <Route path="guest/annual/summary" component={AnnualSummary}/>
      <Route path="/rise/static/guest/value/evaluation/self" component={SelfEvaluate}/>
      <Route path="/rise/static/guest/value/evaluation/other" component={OtherEvaluate}/>
      <Route path="video/course" component={VideoCourse}/>
    </Route>
  </Route>
)

export default routes
