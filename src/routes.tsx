import * as React from 'react'

const path = require('path')
import { Route } from 'react-router'
import Base from './modules/base/Base'
import { config } from './modules/helpers/JsConfig'
import Loading from './Loading'
import Loadable from 'react-loadable'
import DailyTalk from './modules/daily/DailyTalk'
import { sa } from './utils/helpers'

import GlobalRequest from './components/globalalert/GlobalRequest'
import DiscussDistrict from './modules/practice/components/DiscussDistrict/DiscussDistrict'
import CommentSubmit from './modules/practice/common/CommentSubmit/CommentSubmit'
import ApplicationSubmit from './modules/practice/common/ApplicationSubmit/ApplicationSubmit'

const TestVideo = Loadable({
  loader: ()=> import('./modules/test/TestVideo'),
  loading:Loading,
})


const LangdingPage = Loadable({
  loader: () => import('./modules/home/LandingPage'),
  loading: Loading,
})
const LiveListPage = Loadable({
  loader: () => import('./modules/home/livelist/LiveListPage'),
  loading: Loading,
})
const ActivityListPage = Loadable({
  loader: () => import('./modules/home/activitylist/ActivityListPage'),
  loading: Loading,
})
const ProblemDesc = Loadable({
  loader: () => import('./modules/home/problemdesc/ProblemDesc'),
  loading: Loading,
})
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
const KnowledgeShare = Loadable({
  loader: () => import('./modules/practice/knowledge/KnowledgeShare'),
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

const NewProfile = Loadable({
  loader: () => import('./modules/customer/NewProfile'),
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
  loader: () => import('./modules/customer/faq/Feedback'),
  loading: Loading,
})
const Faq = Loadable({
  loader: () => import('./modules/customer/faq/Faq'),
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
const StudyList = Loadable({
  loader: () => import('./modules/customer/person/StudyList'),
  loading: Loading,
})

const ShowCertificate = Loadable({
  loader: () => import('./modules/customer/person/ShowCertificate'),
  loading: Loading,
})

const RichTextView = Loadable({
  loader: () => import('./modules/other/richtext/RichTextView'),
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
      sa.quick('autoTrackSinglePage');
    }}>
      <Route path={'demo'} component={DiscussDistrict}/>
      <Route path="home" component={LangdingPage}/>
      <Route path="home/lives" component={LiveListPage}/>
      <Route path="home/activities" component={ActivityListPage}/>
      <Route path="home/problem" component={ProblemDesc}/>
      <Route path="test/video" component={TestVideo} />

      <Route path="rise" component={SchedulePlan}/>
      <Route path="camp" component={SchedulePlan}/>
      <Route path="learn" component={SchedulePlan}/>
      <Route path="plan/main" component={SchedulePlan}/>


      <Route path="daily/talk" component={DailyTalk}/>

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
      <Route path="guest/practice/knowledge/view" component={KnowledgeShare}/>
      <Route path="practice/knowledge/review" component={KnowledgeReview}/>
      <Route path="practice/submit/comment" component={CommentSubmit}/>
      <Route path="practice/submit/application" component={ApplicationSubmit}/>


      <Route path="message/warmup/reply" component={ReplyDiscussMessage}/>
      <Route path="message/subject/reply" component={Subject}/>
      <Route path="message/application/reply" component={ReplyApplicationComment}/>
      <Route path="message/knowledge/reply" component={ReplyKnowledgeDiscussMessage}/>
      <Route path="message/comment/reply" component={ReplyCommentMessage}/>
      <Route path="guest/card/send" component={SendCard}/>
      <Route path="feedback" component={FeedBack}/>
      <Route path="faq" component={Faq}/>
      <Route path="userprotocol" component={UserProtocol}/>

      <Route path="article" component={RichTextView}/>

      <Route path="coupon" component={Coupon}/>
      <Route path="knowledge/card/list" component={ProblemCardList}/>
      <Route path="person/study/list" component={StudyList}/>
      <Route path="person/certificate" component={ShowCertificate}/>
      <Route path="message/center" component={MessageCenter}/>

      <Route path="customer">
        <Route path="personal" component={Personal}/>
        <Route path="personal/modify" component={PersonalModify}/>
        <Route path="profile" component={Profile}/>
        <Route path="account" component={Account}/>
        <Route path="modify/nickname" component={NickName}/>
        <Route path="modify/headImg" component={HeadImage}/>
        <Route path="point/tip" component={PointTip}/>
        <Route path="problem" component={ProblemGallery}/>
        <Route path="member" component={RiseMember}/>
        <Route path="mobile/check" component={MobileBind}/>
        <Route path="certificate/profile" component={CertificateProfile}/>
        <Route path="certificate" component={Certificate}/>
        <Route path="prize/card/list" component={MineCard}/>
        <Route path="new/profile" component={NewProfile}/>
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
    </Route>
  </Route>
)

export default routes
