function loadSidebarState() {
    let sidebarState = localStorage.getItem("sidebar");
    if (sidebarState === null) {
        localStorage.setItem("sidebar", "maximize");
    }
    if (sidebarState === "minimize") {
        minimizeSidebar();
    } else {
        maximizeSidebar();
    }
}

function minimizeSidebar() {
    $(".nav-links").addClass("minimal");
    $(".menu-icon").removeClass("bx-menu-alt-right").addClass("bx-menu");
    localStorage.setItem("sidebar", "minimize");
}

function maximizeSidebar() {
    $(".nav-links").removeClass("minimal");
    $(".menu-icon").removeClass("bx-menu").addClass("bx-menu-alt-right");
    localStorage.setItem("sidebar", "maximize");
}

function sidebarLinkActive(link) {
    document.getElementById(link).classList.add('active');
}

$(document).ready(function () {
    loadSidebarState();
    $("#nav-menu-btn").click(function () {
        if ($(".nav-links").hasClass("minimal")) {
            maximizeSidebar();
        } else {
            minimizeSidebar();
        }
    });
});

$(document).ready(function () {

    function getBaseApiUrl() {
        return $("#modal-form").data("api-url");
    }

    function showButtonSpinner() {
        $("#modal-form .btn-submit").prop("disabled", true);
        $("#modal-form .btn-submit-text").css("visibility", "hidden");
        $("#modal-form .btn-submit-spinner").css("visibility", "visible");
    }

    function swal2OnResponse(response) {
        $('.modal').modal('hide');
        title = "Success!"
        if (response.status == "error")
            title = "Oops!"
        Swal.fire({
            title: title,
            text: response.message,
            icon: response.status,
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'custom-confirm-btn'
            }
        }).then((result) => {
            window.location.reload(true);
        });
    }

    $(document).on('click dblclick', '.row-data', function (e) {
        if (e.type === 'click') {
            $(".btn-action").prop("disabled", false);
            $(".row-data").removeClass("row-selected");
            $(this).addClass("row-selected");
            elements = $(this).find('.column-data');
        } else if (e.type === 'dblclick') {
            $(".btn-action").prop("disabled", true);
            $(this).removeClass("row-selected");
        }
    });

    $(document).on('click', '.btn-add', function () {
        $(".modal-action-title").eq(0).html("Add");
        $("#modal-form .form-control").val('');
        $("#show-id").css("display", "none");
        $(".readonly-field").prop("readonly", false);
        api_url = getBaseApiUrl() + "create/";
    });

    $(document).on('click', '.btn-edit', function () {
        $(".modal-action-title").eq(0).html("Edit");
        $("#show-id").css("display", "flex");
        $(".readonly-field").prop("readonly", true);
        let modal_elements = $('.modal-data');
        for (let index = 0; index < elements.length; index++) {
            modal_elements.eq(index).val(elements.eq(index).html());
        }
        api_url = getBaseApiUrl() + "update/" + elements.eq(0).html() + "/";
    });

    $(document).on('click', '.btn-delete', function () {
        api_url = getBaseApiUrl() + "delete/" + elements.eq(0).html() + "/";
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'DELETE',
                    url: api_url,
                    headers: {
                        'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val()
                    },
                    success: function (response) {
                        swal2OnResponse(response);
                    },
                    error: function (error) {
                        alert(error);
                        window.location.reload();
                    }
                });
            }
        });
    });

    $('#modal-form').submit(function (event) {
        showButtonSpinner();
        event.preventDefault();
        var form_data = $('#modal-form').serialize();
        $.ajax({
            type: 'POST',
            url: api_url,
            data: form_data,
            headers: {
                'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val()
            },
            success: function (response) {
                swal2OnResponse(response);
            },
            error: function (error) {
                alert(error);
                window.location.reload();
            }
        });
    });

});

function confirmLogout() {
    logout_url = $(".nav-logout").data("logout-url");
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: '#d33',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = logout_url;
        }
    });
}

$(document).ready(function () {

    $('#terminal-input-form').submit(function (event) {
        event.preventDefault();
        var form_data = $('#terminal-input-form').serialize();
        $.ajax({
            type: 'POST',
            url: "/team/api/command/add/",
            data: form_data,
            headers: {
                'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val()
            },
            success: function (response) {
                $("#input-command").prop("readonly", true);
                setTimeout(() => {
                    $("#input-command").val("");
                    window.location.reload();
                }, 5000);
            },
            error: function (error) {
                alert(error);
            }
        });
    });

    $('#terminal-input-form #input-command').keypress(function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#terminal-input-form').submit();
        }
    });

});