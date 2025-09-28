$(document).ready(function() {
    // Set default headers for AJAX requests
    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Function to handle submission of license information
    window.submitLicenseInfo = function () {
        let licenseInfo = {
            licenseeName: $('#licenseeName').val(),
            assigneeName: $('#assigneeName').val(),
            expiryDate: $('#expiryDate').val()
        };
        localStorage.setItem('licenseInfo', JSON.stringify(licenseInfo));

        // Add fade out animation
        $('#form').addClass('opacity-0 scale-95');
        $('#mask').addClass('opacity-0');

        setTimeout(() => {
            $('#mask, #form').hide().removeClass('opacity-0 scale-95');
        }, 300);
    };

    // Function to handle search input
    $('#search').on('input', function(e) {
        $("#product-list").load('/search?search=' + e.target.value);
    });

    // Function to update preview
    window.updatePreview = function() {
        const licenseeName = $('#licenseeName').val() || 'gift95';
        const assigneeName = $('#assigneeName').val() || '野生Bug饲养员';
        const expiryDate = $('#expiryDate').val() || '2111/11/11';

        $('#previewLicenseName').text(licenseeName);
        $('#previewAssigneeName').text(assigneeName);
        $('#previewExpiryDate').text(expiryDate);
    };

    // Function to show license form
    window.showLicenseForm = function () {
        let licenseInfo = JSON.parse(localStorage.getItem('licenseInfo'));
        $('#licenseeName').val(licenseInfo?.licenseeName || 'gift95');
        $('#assigneeName').val(licenseInfo?.assigneeName || '野生Bug饲养员');
        $('#expiryDate').val(licenseInfo?.expiryDate || '2111-11-11');

        // Update preview with current values
        updatePreview();

        // Show with fade in animation
        $('#mask, #form').show();
        setTimeout(() => {
            $('#form').removeClass('opacity-0 scale-95');
            $('#mask').removeClass('opacity-0');
        }, 10);
    };

    // Function to close modal
    window.closeModal = function() {
        $('#form').addClass('opacity-0 scale-95');
        $('#mask').addClass('opacity-0');

        setTimeout(() => {
            $('#mask, #form').hide().removeClass('opacity-0 scale-95');
        }, 300);
    };

    // Close modal when clicking on mask
    $('#mask').on('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Function to show VM options
    window.showVmoptins = function () {
        var text = "-javaagent:/(Your Path)/ja-netfilter/ja-netfilter.jar\n" +
        "--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED\n" +
        "--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED";
        copyText(text)
            .then(() => {
                alert("VM options已复制成功");
            });
    };

    // Function to copy license
    window.copyLicense = async function (e) {
        while (localStorage.getItem('licenseInfo') === null) {
            $('#mask, #form').show();
            await new Promise(r => setTimeout(r, 1000));
        }
        let licenseInfo = JSON.parse(localStorage.getItem('licenseInfo'));
        let productCode = $(e).closest('.card').data('productCodes');
        let data = {
            "licenseName": licenseInfo.licenseeName,
            "assigneeName": licenseInfo.assigneeName,
            "expiryDate": licenseInfo.expiryDate,
            "productCode": productCode,
        };
        $.post('/generateLicense', JSON.stringify(data))
            .then(response => {
                copyText(response)
                    .then(() => {
                        alert("已复制成功");
                    })
                    .catch(() => {
                        alert("系统不支持复制功能,或者当前非SSL访问,若为Local环境,请使用127.0.0.1或者localhost访问.");
                    });
            });
    };

// Function to copy text to clipboard
    const copyText = async (val) => {
        if (navigator.clipboard && navigator.permissions) {
            return navigator.clipboard.writeText(val);
        } else {
            console.log(val);
            const scrollX = window.scrollX;
            const textArea = document.createElement('textarea')
            textArea.value = val
            // 使text area不在viewport，同时设置不可见
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            try {
                const result = document.execCommand('copy');
                return result ? Promise.resolve() : Promise.reject();
            } catch (e) {
                return Promise.reject(e);
            } finally {
                textArea.remove();
                window.scrollTo(scrollX, 0);
            }
        }
    };

});
