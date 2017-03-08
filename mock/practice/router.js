var Router = require("express").Router;

var router = new Router();

router.get("/rise/practice/warmup/start/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"msg": {
				"practice": [{
					"id": 49,
					"question": "请判断下面2段话哪一个符合概括主题的要点？",
					"type": 1,
					"analysis": "选项2中的主题不符合预期，如果用选项2中的主题，人们对内容的预期是解释”男女厕所不应该分开“的原因",
					"voice": null,
					"difficulty": 1,
					"knowledgeId": 6,
					"sceneId": 1,
					"choiceList": [{
						"id": 147,
						"questionId": 49,
						"subject": "中性厕所正在兴起。",
						"sequence": 1,
						"isRight": true,
						"selected": null
					}, {
						"id": 148,
						"questionId": 49,
						"subject": "男女厕所不应该分开。",
						"sequence": 2,
						"isRight": false,
						"selected": null
					}],
					"choice": null
				}, {
					"id": 45,
					"question": "请判断下面这段话作为主题是否适度？\n当今世界已进入信息网络化时代，信息网络化对编辑工作既提出了新的挑战，也带来了难得的发展机遇。当下，互联网在民众的生活中产生着越来越大的影响，“互联网+编辑出版业”也为编辑出版产业提供了广阔的发展空间。如何利用好互联网平台，使其与编辑出版业进行深度融合，为编辑出版工作打造新的局面，是值得编辑出版人深思的话题。目前以网络为代表的新媒体无疑给信息的传播带来了便捷，让编辑编发的成果受众面更为广阔。而同时，“互联网+”带给编辑工作者的冲击也是不小的，对此，编辑工作者就需积极应对。我认为进入网络化社会，编辑要不断学习新知识和技能，创新工作方式。\n ……\n",
					"type": 1,
					"analysis": "主题不符合“适度”，主题中对于背景的介绍太长。",
					"voice": null,
					"difficulty": 1,
					"knowledgeId": 6,
					"sceneId": 1,
					"choiceList": [{
						"id": 136,
						"questionId": 45,
						"subject": "适度",
						"sequence": 1,
						"isRight": false,
						"selected": null
					}, { "id": 137, "questionId": 45, "subject": "不适度", "sequence": 2, "isRight": true, "selected": null }],
					"choice": null
				}, {
					"id": 47,
					"question": "请为下面这段话概括一个最合适的主题：\n为了改善公司目前新入职员工的培训状况：\n 应向管理层强调，对新入职员工的培训十分影响员工的工作质量和忠诚度\n 应在年末给予优秀讲师奖励和表彰，提高讲师的积极性\n 应搜集新入职员工对培训的反馈，调整培训内容，使之更贴合新员工需要\n",
					"type": 1,
					"analysis": "选项1和3的主题都没有思想，而2概括出了有思想的主题",
					"voice": null,
					"difficulty": 1,
					"knowledgeId": 6,
					"sceneId": 1,
					"choiceList": [{
						"id": 141,
						"questionId": 47,
						"subject": "为改善公司目前新入职员工的培训状况，我们提出3点建议",
						"sequence": 1,
						"isRight": false,
						"selected": null
					}, {
						"id": 142,
						"questionId": 47,
						"subject": "为改善公司目前新入职员工的培训状况，我们必须有所行动，促使培训体制中各参与主体支持培训",
						"sequence": 2,
						"isRight": true,
						"selected": null
					}, {
						"id": 143,
						"questionId": 47,
						"subject": "为改善公司目前新入职员工的培训状况，步骤如下",
						"sequence": 3,
						"isRight": false,
						"selected": null
					}],
					"choice": null
				}]
			}, "code": 200
		}), Math.random() * 1500)
});

router.get("/rise/practice/warmup/analysis/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"practice": [
					{
						"id": 1, //题目id
						"question": "题干", //问题题干
						"analysis": "balbal", //问题分析
						"voice": "http://someurl", //语音分析链接
						"type": 1, //1-单选题，2-多选题
						"Difficulty": 1, //1-简单，2-普通，3-困难
						"choiceList": [
							{
								"id": 1,
								"questionId": 1, //问题id
								"subject": "选项1", //选项题干
								"sequence": 1, //选项顺序
								"isRight": false,  //是否是正确选项
								"selected": false //用户是否选择
							},
							{
								"id": 2,
								"questionId": 1,
								"subject": "选项2",
								"sequence": 2,
								"isRight": true,
								"selected": true
							},
							{
								"id": 3,
								"questionId": 1,
								"subject": "选项2",
								"sequence": 2,
								"isRight": true,
								"selected": false
							},
							{
								"id": 4,
								"questionId": 1,
								"subject": "选项2",
								"sequence": 2,
								"isRight": false,
								"selected": true
							}
						],
            "discussList": [
              {
                "id":2,
                "repliedId": 1,
                "comment":"回复回复",
                "repliedName": "风之伤",
                "repliedComment": "评论评论评论",
                "warmupPracticeId": 49,
                "name":"Diane",
                "avatar":"http://wx.qlogo.cn/mmopen/Q3auHgzwzM4j579r72ltlZK0uBEz3klv57pOrqolSjZONIIlyffo4ib5p7sneIH4MgXyCKzKOKBiaCTkQUyu15XKiaeSppaJ0U3j1OBLIOrxrk/0",
                "discussTime":"10:30"
              },

              {
                "id":1,
                "repliedId": null,
                "comment":"评论评论评论",
                "repliedName": null,
                "repliedComment": null,
                "warmupPracticeId": 49,
                "name":"风之伤",
                "avatar":"http://wx.qlogo.cn/mmopen/Q3auHgzwzM4j579r72ltlZK0uBEz3klv57pOrqolSjZONIIlyffo4ib5p7sneIH4MgXyCKzKOKBiaCTkQUyu15XKiaeSppaJ0U3j1OBLIOrxrk/0",
                "discussTime":"10:38"
              }
            ],
					},
					{
						"id": 2, //题目id
						"question": "题干", //问题题干
						"analysis": "balbal", //问题分析
						"voice": "http://someurl", //语音分析链接
						"type": 1, //1-单选题，2-多选题
						"Difficulty": 1, //1-简单，2-普通，3-困难
						"choiceList": [
							{
								"id": 1,
								"questionId": 1, //问题id
								"subject": "选项1", //选项题干
								"sequence": 1, //选项顺序
								"isRight": false,  //是否是正确选项
								"selected": false //用户是否选择
							},
							{
								"id": 2,
								"questionId": 1,
								"subject": "选项2",
								"sequence": 2,
								"isRight": true,
								"selected": true
							},
							{
								"id": 3,
								"questionId": 1,
								"subject": "选项2",
								"sequence": 2,
								"isRight": true,
								"selected": false
							},
							{
								"id": 4,
								"questionId": 1,
								"subject": "选项2",
								"sequence": 2,
								"isRight": false,
								"selected": true
							}
						]
					}
				]
			}
		}), Math.random() * 1500)
});

router.post("/rise/practice/warmup/answer/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"rightNumber": 3, //正确题数
				"point": 2000 //积分
			}
		}), Math.random() * 1500)
});

router.get("/rise/practice/next/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"knowledge": {
					"Id": 1,
					"knowledge": "知识点描述", //知识点描述
					"appear": 0, //是否出现过,0-未出现，1-出现过
				},
				"type": 21, // 1-单选题，2-多选题，11-应用题，21-挑战题
				"status": 1, // 0-未完成，1-已完成
				"unlocked": true, //是否解锁
				"practiceIdList": [1, 2, 3], //训练id
				"series": 1, //组号
				"sequence": 1 //组内顺序
			}
		}), Math.random() * 1500)
});

router.get("/rise/practice/application/start/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"id": 1,
				"description": "balbal",
				"pic": "http://www.iquanwai.com/images/cintro1.png",
				"knowledgeId": 1,
				"sceneId": 1,
				"difficulty": null,
        "content": null, //提交内容
        "submitId": 1, //提交id
        "submitUpdateTime": "2017-02-15" ,//最后提交时间
        "voteCount": 0,
        "commentCount": 0,
        "voteStatus": 0
			}
		}), Math.random() * 1500)
});

router.get("/rise/practice/challenge/start/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"id": 1,
				"description": "图文混排内容", //html
				"pic": "http://www.iquanwai.com/images/cintro1.png",  //图片url
				"problemId": 1, //问题id
				"pcurl": "http://someurl", //pc端url
				"content": "balbal", //提交内容
        "submitId": 1, //提交id
        "submitUpdateTime": "2017-02-15" //最后提交时间
			}
		}), Math.random() * 1500)
});

router.post("/rise/practice/discuss", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": "ok"
    }), Math.random() * 1500)
});

router.get("/rise/practice/load/discuss/*/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": [
        {
          "id":2,
          "repliedId": 1,
          "comment":"新增的评论",
          "repliedName": "风之伤",
          "repliedComment": "评论评论评论",
          "warmupPracticeId": 49,
          "name":"Diane",
          "avatar":"http://wx.qlogo.cn/mmopen/Q3auHgzwzM4j579r72ltlZK0uBEz3klv57pOrqolSjZONIIlyffo4ib5p7sneIH4MgXyCKzKOKBiaCTkQUyu15XKiaeSppaJ0U3j1OBLIOrxrk/0",
          "discussTime":"10:30"
        },

        {
          "id":1,
          "repliedId": null,
          "comment":"评论评论评论",
          "repliedName": null,
          "repliedComment": null,
          "warmupPracticeId": 49,
          "name":"风之伤",
          "avatar":"http://wx.qlogo.cn/mmopen/Q3auHgzwzM4j579r72ltlZK0uBEz3klv57pOrqolSjZONIIlyffo4ib5p7sneIH4MgXyCKzKOKBiaCTkQUyu15XKiaeSppaJ0U3j1OBLIOrxrk/0",
          "discussTime":"10:38"
        }
      ]
    }), Math.random() * 1500)
});

router.post("/rise/practice/application/submit/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": "ok"
    }), Math.random() * 1500)
});

router.post("/rise/practice/challenge/submit/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": "ok"
    }), Math.random() * 1500)
});


router.get('/rise/practice/warmup/new/analysis/*', (req, res) =>{
  setTimeout(() =>
    res.status(200).json({
      "msg": {
        "id": 1, //题目id
        "question": "题干", //问题题干
        "analysis": "balbal", //问题分析
        "voice": "http://someurl", //语音分析链接
        "type": 1, //1-单选题，2-多选题
        "difficulty": 1, //1-简单，2-普通，3-困难
        "knowledgeId":2, //知识点
        "choiceList": [
          {
            "id": 1,
            "questionId": 1, //问题id
            "subject": "选项1", //选项题干
            "sequence": 1, //选项顺序
            "isRight": false,  //是否是正确选项
            "selected": false //用户是否选择
          },
          {
            "id": 2,
            "questionId": 1,
            "subject": "选项2",
            "sequence": 2,
            "isRight": true,
            "selected": true
          },
          {
            "id": 3,
            "questionId": 1,
            "subject": "选项2",
            "sequence": 2,
            "isRight": true,
            "selected": false
          },
          {
            "id": 4,
            "questionId": 1,
            "subject": "选项2",
            "sequence": 2,
            "isRight": false,
            "selected": true
          }
        ],
        "discussList": [
          {
            "id":2,
            "repliedId": 1,
            "comment":"回复回复",
            "repliedName": "风之伤",
            "repliedComment": "评论评论评论",
            "warmupPracticeId": 49,
            "name":"Diane",
            "avatar":"http://wx.qlogo.cn/mmopen/Q3auHgzwzM4j579r72ltlZK0uBEz3klv57pOrqolSjZONIIlyffo4ib5p7sneIH4MgXyCKzKOKBiaCTkQUyu15XKiaeSppaJ0U3j1OBLIOrxrk/0",
            "discussTime":"10:30"
          },

          {
            "id":1,
            "repliedId": null,
            "comment":"评论评论评论",
            "repliedName": null,
            "repliedComment": null,
            "warmupPracticeId": 49,
            "name":"风之伤",
            "avatar":"http://wx.qlogo.cn/mmopen/Q3auHgzwzM4j579r72ltlZK0uBEz3klv57pOrqolSjZONIIlyffo4ib5p7sneIH4MgXyCKzKOKBiaCTkQUyu15XKiaeSppaJ0U3j1OBLIOrxrk/0",
            "discussTime":"10:38"
          }
        ],
      }, "code": 200
    }), Math.random() * 1500)
})

router.get("/rise/practice/warmup/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": {
        "id": 13,
        "question": "如何战胜公开发言恐慌症？1、 发言前:准备好讲稿，反复演练提前到场熟悉发言环境上台前深呼吸放松心情2、发言时：眼睛盯住远方一个点避免紧张3、 发言后：收集听众的正面反馈，树立信心这段话符合时间顺序的哪种子结构类型",
        "type": 1,
        "analysis": "这段话按照时间顺序，按照发言前、发言时、发言后几个时间点提出了消除恐惧心理的方法。不属于步骤/流程，也没有因果关系",
        "voice": null,
        "difficulty": 1,
        "knowledgeId": 2,
        "sceneId": 1,
        "score": null,
        "choiceList": null,
        "discussList": null,
        "choice": null
      }
    }), Math.random() * 1500)
});

router.post("/rise/practice/vote", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": "ok"
    }), Math.random() * 1500)
});

router.get("/rise/practice/application/list/other/*",(req,res)=>{
  setTimeout(()=>{
    res.status(200).json(
      {
        "msg": [
          {
            "title": null,
            "userName": "nethunder",
            "submitUpdateTime": "2017-02-27",
            "headImage": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLA6Yg58o1S3RwgdnMAIt01fo39veibmsokIa7NuaZ1m8fmxAL9VUdjyHHib5iaLSf1ZnzhawhdPcicicTnfVnyFlUViaRXyjnNibuTNws/0",
            "content": "测试",
            "voteCount": 0,
            "commentCount": 0,
            "submitId": 96,
            "type": 11,
            "voteStatus": 0
          },
          {
            "title": null,
            "userName": "张凯雯",
            "submitUpdateTime": "2017-02-18",
            "headImage": "http://wx.qlogo.cn/mmopen/JeB8LAjhPIcjw65snUszvxogCNX1yV90K3QEa68sIXjVLuvaapaUUJ8Bs7vzJyHNiat3leIHz5F7m9UbLa6G4V9jvJQduGbQx/0",
            "content": "为什么戴尔不收购其他信息存储公司\n",
            "voteCount": 0,
            "commentCount": 0,
            "submitId": 80,
            "type": 11,
            "voteStatus": 0
          }
        ],
        "code": 200
      }
    )
  },Math.random()*1500);
});

router.get("/rise/practice/challenge/list/other/*",(req,res)=>{
  setTimeout(()=>{
    res.status(200).json(
      {
        "msg": [
          {
            "title": null,
            "userName": "薛定谔的猫",
            "submitUpdateTime": "2017-01-24",
            "headImage": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7wkhob9zgicD3IJxG1tLVSSe9qdzR1qUGXz6BwPv73sr67iaTEibcA1sNic3Roib4DgXCVG4IWe0zPAKJnlo5r4NibezssS6naic6dkM/0",
            "content": "ffefrgergerghthhthfewfewffewffwefwef",
            "voteCount": 1,
            "commentCount": 29,
            "submitId": 71,
            "type": 21,
            "voteStatus": null
          },
          {
            "title": null,
            "userName": "张凯雯",
            "submitUpdateTime": "2017-01-21",
            "headImage": "http://wx.qlogo.cn/mmopen/JeB8LAjhPIcjw65snUszvxogCNX1yV90K3QEa68sIXjVLuvaapaUUJOXw9P8qYcWlu3CuSsTEjdPuIoHhFWnIypmX6W84XzX/0",
            "content": "今天跟所有人说话前，都先停30先想逻辑",
            "voteCount": 1,
            "commentCount": 8,
            "submitId": 73,
            "type": 21,
            "voteStatus": null
          },
          {
            "title": null,
            "userName": "薛定谔的猫",
            "submitUpdateTime": "2017-02-04",
            "headImage": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7wkhob9zgicD3IJxG1tLVSSe9qdzR1qUGXz6BwPv73sr67iaTEibcA1sNic3Roib4DgXCVG4IWe0zPAKJnlo5r4NibezssS6naic6dkM/0",
            "content": "提交圈外\n\n首页\n\nRISE\n薛定谔的猫\n专题\n与人沟通时条理更清晰\n跟老板/家人提要求时更有说服力\n面对前所未有的新问题时撬开脑洞\n临场发言也能掷地有声\n与人撕逼时找到对方漏洞\n我的心得\nHi，欢迎来到圈外社区。\n请按照手机端挑战任务的页面提示，在这里记录下你学习的小目标、感悟或经历吧！\n小提示\n完成小目标，获得相应的积分。\n训练期间的每日收获，以及最后的......",
            "voteCount": 1,
            "commentCount": 5,
            "submitId": 83,
            "type": 21,
            "voteStatus": null
          },
          {
            "title": null,
            "userName": "朱林源Juliet",
            "submitUpdateTime": "2017-01-23",
            "headImage": "http://wx.qlogo.cn/mmopen/DRC1udVVibvW6lHtaHXaPO6w1U0cgicWyPMZBY35VByWwApxkvQrJXOX74DnLDicoias5uJMBryPcuNRAJULL7NCj96FPrAeQUKo/0",
            "content": "完成训练后能更加条理清晰的与人沟通",
            "voteCount": 1,
            "commentCount": 4,
            "submitId": 75,
            "type": 21,
            "voteStatus": null
          },
          {
            "title": null,
            "userName": "(*¯︶¯*)微笑、淡然",
            "submitUpdateTime": "2017-01-26",
            "headImage": "http://wx.qlogo.cn/mmopen/DRC1udVVibvW6lHtaHXaPO5OpnUfXTwdgg2CYadWIbKia0JKe5GcAtZTbbk3jFMZag5Db0SkmWVUYbjaGeKgVOWpQm5HQ7kd5e/0",
            "content": "测试",
            "voteCount": 1,
            "commentCount": 3,
            "submitId": 76,
            "type": 21,
            "voteStatus": null
          },
          {
            "title": null,
            "userName": "圈外助手",
            "submitUpdateTime": "2017-01-26",
            "headImage": "http://wx.qlogo.cn/mmopen/DRC1udVVibvVx3HW1ha4UP24Grs1Pfwu2Rm7mYEOofNQKibosic8O0A1DMMkpAHH2cxagMO5moGgeMDTxk6cU4h7mYwtMzFJ5Xm/0",
            "content": "tewtwe",
            "voteCount": 1,
            "commentCount": 2,
            "submitId": 77,
            "type": 21,
            "voteStatus": null
          },
          {
            "title": null,
            "userName": "圈外助手",
            "submitUpdateTime": "2017-01-26",
            "headImage": "http://wx.qlogo.cn/mmopen/DRC1udVVibvVx3HW1ha4UP24Grs1Pfwu2Rm7mYEOofNQKibosic8O0A1DMMkpAHH2cxagMO5moGgeMDTxk6cU4h7mYwtMzFJ5Xm/0",
            "content": "est",
            "voteCount": 0,
            "commentCount": 2,
            "submitId": 78,
            "type": 21,
            "voteStatus": null
          },
          {
            "title": null,
            "userName": "张凯雯",
            "submitUpdateTime": "2017-02-19",
            "headImage": "http://wx.qlogo.cn/mmopen/JeB8LAjhPIcjw65snUszvxogCNX1yV90K3QEa68sIXjVLuvaapaUUJOXw9P8qYcWlu3CuSsTEjdPuIoHhFWnIypmX6W84XzX/0",
            "content": "表达更清晰",
            "voteCount": 0,
            "commentCount": 0,
            "submitId": 93,
            "type": 21,
            "voteStatus": null
          }
        ],
        "code": 200
      }
    )
  },Math.random()*1500);
});

router.get("/rise/practice/comment/*",(req,res)=>{
  setTimeout(()=>{
    res.status(200).json(
      {
        "msg": [
          {
            "id": 52,
            "content": "fff ",
            "upName": "薛定谔的猫",
            "upTime": "2017-01-23",
            "headPic": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7wkhob9zgicD3IJxG1tLVSSe9qdzR1qUGXz6BwPv73sr67iaTEibcA1sNic3Roib4DgXCVG4IWe0zPAKJnlo5r4NibezssS6naic6dkM/0"
          },
          {
            "id": 51,
            "content": "测试评论",
            "upName": "薛定谔的猫",
            "upTime": "2017-01-23",
            "headPic": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7wkhob9zgicD3IJxG1tLVSSe9qdzR1qUGXz6BwPv73sr67iaTEibcA1sNic3Roib4DgXCVG4IWe0zPAKJnlo5r4NibezssS6naic6dkM/0"
          },
          {
            "id": 38,
            "content": "test",
            "upName": "薛定谔的猫",
            "upTime": "2017-01-22",
            "headPic": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7wkhob9zgicD3IJxG1tLVSSe9qdzR1qUGXz6BwPv73sr67iaTEibcA1sNic3Roib4DgXCVG4IWe0zPAKJnlo5r4NibezssS6naic6dkM/0"
          },
          {
            "id": 37,
            "content": "fewfwef",
            "upName": "薛定谔的猫",
            "upTime": "2017-01-22",
            "headPic": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7wkhob9zgicD3IJxG1tLVSSe9qdzR1qUGXz6BwPv73sr67iaTEibcA1sNic3Roib4DgXCVG4IWe0zPAKJnlo5r4NibezssS6naic6dkM/0"
          },
          {
            "id": 36,
            "content": "comment",
            "upName": "薛定谔的猫",
            "upTime": "2017-01-22",
            "headPic": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7wkhob9zgicD3IJxG1tLVSSe9qdzR1qUGXz6BwPv73sr67iaTEibcA1sNic3Roib4DgXCVG4IWe0zPAKJnlo5r4NibezssS6naic6dkM/0"
          }
        ],
        "code": 200
      }
    );
  },Math.random()*1500);
});


router.post("/rise/practice/comment/*",(req,res)=>{
  setTimeout(()=>{
    res.status(200).json(
      {"msg":{"id":null,"content":"ccccc","upName":"风之伤","upTime":"2017-03-01","headPic":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488373052881&di=7a470b200f5f2f97d0d7fe5598c34cf9&imgtype=0&src=http%3A%2F%2Fci.xiaohongshu.com%2F5c3f7604-0ca9-4d7d-bcc3-8d8667399307%40r_640w_640h.jpg"},"code":200}
    );
  },Math.random()*1500);
});

router.post("/rise/practice/check/*",(req,res)=>{
  setTimeout(()=>{
    res.status(200).json(
      {"msg":"完成之前的理解训练，才能解锁该训练","code":221}
    );
  },Math.random()*1500);
});

module.exports = router;
