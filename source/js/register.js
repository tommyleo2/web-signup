function reset() {
    $(".box").each(function() {
        $(this).find("input").val("");
        $(".judge").removeClass("judgeInvalid").removeClass("judgeValid");
    });
}

function checkSubmit() {
    var canSubmit = true;
    $(".judge").each(function() {
        if ($(this).hasClass("judgeInvalid") || !$($(this).siblings("input")[0]).val()) {
            canSubmit = false;
        }
    });
    return canSubmit;
}

function judge(name, value) {
    var valid;
    if (!value) {
        $("#" + name + "J").removeClass("judgeInvalid judgeValid");
        return;
    }
    if (name == "username") {
        valid = value.match(/^([a-zA-Z]){1}([a-zA-Z0-9_]){5,17}$/);
    }
    else if (name == "id") {
        valid = value.match(/^([1-9]){1}([0-9]){7,7}$/);
    }
    else if (name == "phone") {
        valid = value.match(/^([1-9]){1}([0-9]){10}$/);
    }
    else if (name == "email") {
        valid = value.match(/^[0-9a-zA-Z_\-]+@(([a-zA-Z])+\.)+[a-zA-Z]{2,4}$/);
    }
    if (valid) {
        $("#" + name + "J").removeClass("judgeInvalid").addClass("judgeValid");
        if (checkSubmit()) {
            $("#submit").attr("disabled", false).removeClass("notSubmit").addClass("submit");
        }
    } else {
        $("#" + name + "J").removeClass("judgeValid").addClass("judgeInvalid");
        $("#submit").attr("disabled", true).removeClass("submit").addClass("notSubmit");
    }
}

function display(msg, block) {
    //setTimeout(function(block) {
        $(block).text(msg);
    //}, 100, block);
}

function info(block) {
    if ($(block).hasClass("judgeInvalid")) {
        var name = $($(block).siblings("input")[0]).attr("name");
        var value = $(block).siblings("input")[0].value;
        $(block).removeClass("judgeInvalid").addClass("info");
        if (name == "name") {
            if (value[0] >= '0' && value[0] <= '9') {
                display("English characters initial only", block);
            }
            else if (value.length < 6 || value.length > 18) {
                display("6 characters at least and 18 at most", block);
            }
        }
        else if (name == "id") {
            if (value.match(/\D/)) {
                display("Numbers only", block);
            }
            else if (value.length != 8) {
                display("Should be 8 numbers", block);
            }
        }
        else if (name == "phone") {
            if (value.match(/\D/)) {
                display("Numbers only", block);
            }
            else if (value.length != 11) {
                display("Should be 11 numbers", block);
            }
        }
        else if (name == "email") {
            display("Invald email address", block);
        }
    }
}

$("document").ready(function() {
    $("#reset").click(reset);
    $("#submit").attr("disabled", true);
    $(".box input").each(function() {
        $(this).bind("input propertychange", function() {
            judge($(this).attr("name"), $(this).val());
        });
    });
    $(".judge").each(function() {
        $(this).mouseenter(function() {
            info(this);
        });
        $(this).mouseleave(function() {
            if ($(this).hasClass("info")) {
                $(this).removeClass("info").text("");
                setTimeout(function(block) {
                    $(block).addClass("judgeInvalid");
                }, 100, this);
            }
        });
    });
});
