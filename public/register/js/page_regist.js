$(document).ready(function() {

    //获取JS传递的语言参数
    var utils = new Utils();
    var args = utils.getScriptArgs();


    //隐藏Loading/注册失败 DIV
    $(".loading").hide();
    $(".login-error").hide();
    registError = $("<label class='error repeated'></label>");

    //加载国际化语言包资源
    utils.loadProperties(args.lang);

    //输入框激活焦点、移除焦点
    jQuery.focusblur = function(focusid) {
        var focusblurid = $(focusid);
        var defval = focusblurid.val();
        focusblurid.focus(function() {
            var thisval = $(this).val();
            if (thisval == defval) {
                $(this).val("");
            }
        });
        focusblurid.blur(function() {
            var thisval = $(this).val();
            if (thisval === "") {
                $(this).val(defval);
            }
        });

    };
    /*下面是调用方法*/
    //$.focusblur("#email");

    //获取表单验证对象[填写验证规则]
    var validate = $("#signupForm").validate({
        rules: {
            username: {
                required: true,

            },
            /*
            email: {
                required: true,
                email: true
            },
            */
            password: {
                required: true,
                minlength: 4,
                maxlength: 16
            },
            passwordAgain: {
                required: true,
                minlength: 4,
                maxlength: 16,
                equalTo: "#password"
            },
            contact: {
                required: true
            }
            /*,
                        company: {
                            required: true
                        },
                        tel: {
                            required: true,
                            digits: true
                        },
                        qq: {
                            required: true,
                            digits: true
                        }
            */
        },
        messages: {
            username: {
                required: $.i18n.prop("请输入用户名"),
                username: $.i18n.prop("PleaseInputCorrectUsername")
            },
            /*
            email: {
                required: $.i18n.prop("请输入邮箱"),
                email: $.i18n.prop("PleaseInputCorrectEmail")
            },
            */
            password: {
                required: $.i18n.prop("请输入密码"),
                minlength: jQuery.format($.i18n.prop("PasswordFormat")),
                maxlength: jQuery.format($.i18n.prop("PasswordFormatMax"))
            },
            passwordAgain: {
                required: $.i18n.prop("请输入确认密码"),
                minlength: jQuery.format($.i18n.prop("PasswordFormat")),
                maxlength: jQuery.format($.i18n.prop("PasswordFormatMax")),
                equalTo: jQuery.format($.i18n.prop("密码输入不一致"))
            },
            contact: {
                required: $.i18n.prop("请输入手机号")
            }
            /*,
                        company: {
                            required: $.i18n.prop("PleaseInputCompany")
                        },
                        tel: {
                            required: $.i18n.prop("PleaseInputTel"),
                            digits: $.i18n.prop("IncorrectFormatTel")
                        },
                        qq: {
                            required: $.i18n.prop("PleaseInputQQ"),
                            digits: $.i18n.prop("IncorrectFormatQQ")
                        }
                        */
        }
    });


    //输入框激活焦点、溢出焦点的渐变特效
    if ($("#username").val()) {
        $("#username").prev().fadeOut();
    }
    $("#username").focus(function() {
        $(this).prev().fadeOut();
    });
    $("#username").blur(function() {
        if (!$("#username").val()) {
            $(this).prev().fadeIn();
        }
    });
    /*
    if ($("#email").val()) {
        $("#email").prev().fadeOut();
    }
    $("#email").focus(function() {
        $(this).prev().fadeOut();
    });
    $("#email").blur(function() {
        if (!$("#email").val()) {
            $(this).prev().fadeIn();
        }
    });
    */
    if ($("#password").val()) {
        $("#password").prev().fadeOut();
    }
    $("#password").focus(function() {
        $(this).prev().fadeOut();
    });
    $("#password").blur(function() {
        if (!$("#password").val()) {
            $(this).prev().fadeIn();
        }
    });
    if ($("#passwordAgain").val()) {
        $("#passwordAgain").prev().fadeOut();
    }
    $("#passwordAgain").focus(function() {
        $(this).prev().fadeOut();
    });
    $("#passwordAgain").blur(function() {
        if (!$("#passwordAgain").val()) {
            $(this).prev().fadeIn();
        }
    });
    if ($("#contact").val()) {
        $("#contact").prev().fadeOut();
    }
    $("#contact").focus(function() {
        $(this).prev().fadeOut();
    });
    $("#contact").blur(function() {
        if (!$("#contact").val()) {
            $(this).prev().fadeIn();
        }
    });
    /*
    if ($("#company").val()) {
        $("#company").prev().fadeOut();
    }
    $("#company").focus(function() {
        $(this).prev().fadeOut();
    });
    $("#company").blur(function() {
        if (!$("#company").val()) {
            $(this).prev().fadeIn();
        }
    });
    if ($("#tel").val()) {
        $("#tel").prev().fadeOut();
    }
    $("#tel").focus(function() {
        $(this).prev().fadeOut();
    });
    $("#tel").blur(function() {
        if (!$("#tel").val()) {
            $(this).prev().fadeIn();
        }
    });
    if ($("#qq").val()) {
        $("#qq").prev().fadeOut();
    }
    $("#qq").focus(function() {
        $(this).prev().fadeOut();
    });
    $("#qq").blur(function() {
        if (!$("#qq").val()) {
            $(this).prev().fadeIn();
        }
    });
*/


    //ajax提交注册信息
    $("#submit").bind("click", function() {
        regist(validate);
    });

    $("body").each(function() {
        $(this).keydown(function(event) {
            if (window.event.keyCode == 13) {
                regist(validate);
            }
        });
    });

});

function regist(validate) {
    //校验Email, password，校验如果失败的话不提交
    if (validate.form()) {
        if ($("#checkBox").attr("checked")) {
            var action = $(this).attr('action');
            var md5 = new MD5();
            $.ajax({
                url: action, //发送请求的地址,这里换成你写好的用于把表转换成JSON的后台处理文件地址，比如a.aspx?参数
                type: "post",
                data: {
                    username: $("#username").val(),
                    //email:$("email").val(),
                    password: md5.MD5($("#password").val()),
                    contact: $("#contact").val()
                        //companyName: $("#company").val(),
                        //tel: $("#tel").val(),
                        //QQ: $("#qq").val()

                },
                //dataType: "json",
                beforeSend: function() {
                    $('.loading').show();
                },
                ////这里后端服务器要返回一个data.json格式，仅包含一个对象，并非对象数组 var data={"code":数字};
                success: function(data) {
                    //alert(JSON.stringify(data));
                    $('.loading').hide();
                    if (data.hasOwnProperty("code")) {
                        if (data.code === 0) {
                            //注册成功
                            //$container.html('sucessful.');
                            alert("注册成功");
                            window.location.href = "/login";
                        } else if (data.code === 1) {
                            //数据库链接失败
                            $(".login-error").html($.i18n.prop("Error.Exception"));
                            /*} else if (data.code == 2) {
                                //参数传递失败
                                $(".login-error").show();
                                $(".login-error").html($.i18n.prop("Error.ParameterError"));
                            */
                            /*
                            } else if (data.code == 3) {
                                //公司已经被注册
                                $("#company").addClass("error");
                                $("#company").after(registError);
                                $("#company").next("label.repeated").text($.i18n.prop("Error.CompaniesAlreadyExists"));
                                registError.show();
                            */
                        } else if (data.code === 2) {
                            //用户名已经被注册
                            $("#username").addClass("error");
                            $("#username").after(registError);
                            $("#username").next("label.repeated").text($.i18n.prop("用户名已存在"));
                            registError.show();

                        } else {
                            //系统错误
                            $(".login-error").html($.i18n.prop("系统错误"));
                        }
                    }
                },
                error: function() {
                    //$container.html('there was a problem.');
                }
            });
        } else {
            //勾选隐私政策和服务条款
            $(".login-error").show();
            $(".login-error").html($.i18n.prop("Error.ReadAndAgree"));
        }
    }
}

var Utils = function() {};

Utils.prototype.loadProperties = function(lang) {
    jQuery.i18n.properties({ // 加载资浏览器语言对应的资源文件
        name: 'ApplicationResources',
        language: lang,
        path: 'register/i18n/',
        mode: 'map',
        callback: function() { // 加载成功后设置显示内容
        }
    });
};

Utils.prototype.getScriptArgs = function() { //获取多个参数
    var scripts = document.getElementsByTagName("script"),
        //因为当前dom加载时后面的script标签还未加载，所以最后一个就是当前的script
        script = scripts[scripts.length - 1],
        src = script.src,
        reg = /(?:\?|&)(.*?)=(.*?)(?=&|$)/g,
        temp, res = {};
    while ((temp = reg.exec(src)) !== null) res[temp[1]] = decodeURIComponent(temp[2]);
    return res;
};