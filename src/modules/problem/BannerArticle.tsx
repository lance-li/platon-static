import * as React from 'react'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import ProblemItem from  './components/ProblemItem'
import { isEqual, merge, set } from 'lodash'
import { loadAllProblems } from './async'
import './BannerArticle.less'

@connect(state => state)
export default class BannerArticle extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(startLoad())
    loadAllProblems().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        let problems = {}
        for(let i = 0; i < res.msg.length; i++) {
          let p = res.msg[ i ]
          set(problems, `p${p.id}`, p)
          this.setState({ problems: problems })
        }
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  clickProblem(problem) {
    let param = {
      id: problem.id
    }
    this.context.router.push({ pathname: '/rise/static/plan/view', query: param })
  }

  render() {
    const { showId } = this.props.location.query
    const { problems } = this.state

    const renderHeader = (showId) => {
      switch(Number(showId)) {
        case 1:
          return '如何升级你的大脑'
        case 2:
          return '如何在社交场合游刃有余'
        case 3:
          return '如何在职场中华丽转身'
        case 4:
          return '如何让你的话更有力量'
        default:
          return '圈外同学'
      }
    }
    return (
      <div>
        <div className="banner-article">
          <div className="page-header">
            <span className="title-font"> {renderHeader(showId)}</span>
          </div>
          {problems ?
            <div className="container banner-container">
              {isEqual(Number(showId), 1) ? <div style={{ margin: '15px 0' }}>
                <span className="normal_font"> 财富是一个人思考能力的产物，当能够获取足够多知识的时候，最终决定你工作质量和收入的，往往是你的思考能力。<br/>
                升级你的大脑，提高思考能力，有以下几个方面：<br/>
                首先，找到真正需要解决的本质问题，不做无用功；<br/>
                </span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p9} clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">其次，面对前所未有的新问题，利用创新思维撬开脑洞；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p3} clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">然后，面对他人的观点，保持独立，不人云亦云。<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p12}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font"> 以上三个方面都在升级你的理性脑。<br/>
                然而，情绪脑也不能被忽略，如果不能管理好情绪，理性的作用就无法发挥出来。<br/>
                  因此你还需要，升级情绪脑，别让情绪浪费了你的努力。<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p18}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
              </div> : null}

              {isEqual(Number(showId), 2) ? <div style={{ margin: '15px 0' }}>
                <span className="normal_font">为什么有些人在社交场合可以游刃有余，有的人却到处碰壁？<br/>
                这是因为，社交高手都”会说话“——他们知道在社交场合该说什么、怎么说、如何赢得他人的支持、以及知道如何靠说话结识比自己牛的人。<br/>
                  这一系列课程，首先教你去洞察他人行为背后的真相，进行有针对性地交流；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p11}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">其次，通过结构化思维训练，使沟通条理更清晰；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p1}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">然后，利用影响力法则，赢得他人的支持；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p16}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">最后，升级你的社交圈，结识比自己牛的人。</span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p19}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
              </div> : null}


              {isEqual(Number(showId), 3) ? <div style={{ margin: '15px 0' }}>
              <span className="normal_font">  想跳槽却不知往什么方向发展？<br/>
                不知道什么职业适合自己？<br/>
                即便有了明确的岗位目标，也不知如何”包装“自己、打动面试官的心？<br/>
                当你有这些问题时，以下课程可以帮你在职场中华丽转身：<br/>
                首先，利用商业模式画布，给自己制定一份个人发展战略，优化职业决策；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p8}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">其次了解企业的真正需求，进而包装自己的简历；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p6}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">最后，知道面试官究竟想听什么，在面试中脱颖而出。<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p7}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
              </div> : null}


              {isEqual(Number(showId), 4) ? <div style={{ margin: '15px 0' }}>
               <span className="normal_font"> 为什么你在工作会议上做过的提案，得不到领导认可？<br/>
                为什么你在工作交流中说过的话，得不到同事重视？<br/>
                你的问题可能不在于方案本身，而在于沟通方法！<br/>
                 这一系列课程，首先通过结构化思维训练，让你在沟通时条理更清晰；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p1}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">其次，用故事包装你的观点、以及借助演讲的力量，更好地说服别人；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p14}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <br/>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p13}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">接着，一针见血地找到对方的逻辑漏洞；<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p5}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
                <span className="normal_font">最后，通过影响力法则，让他人不再对我们说不。<br/></span>
                <div className="problem-box">
                  <ProblemItem width={window.innerWidth - 30}
                               rootStyle={{ padding: '15px 0' }}
                               problem={problems.p16}
                               clickHandler={(problem) => this.clickProblem(problem)}/>
                </div>
              </div> : null}
            </div>
            : null}
        </div>
        <div className="show-more" style={{ borderTop: '1px solid #efefef' }}>没有更多了</div>
      </div>
    )
  }
}
