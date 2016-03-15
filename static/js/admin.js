$(document).ready(function() {
    $("#datatable").dataTable({
        "aaSorting": [[0, "desc"]]
    });

    $("#description").redactor();

    if ($(".flashMessenger").length == 1) {
        var fmClass = $(".flashMessenger").attr('class').replace('flashMessenger', '').replace(' ', '');
        if (fmClass == 'fm-good') {
            $(".alert").addClass('alert-success');
        } else {
            $(".alert").addClass('alert-error');
        }
    }

    $("a.btn-danger").live('click', function(event) {
        var confirmed = confirm("Are you sure?");

        if (!confirmed) {
            event.preventDefault();
        }
    });

    if ($("#meta").length == 1) {
        var meta = $("#meta");
        var metaValue = meta.val();
        if (metaValue != '') {
            metaValue = $.parseJSON(metaValue);
            if ('description' in metaValue) {
                metaValue = metaValue['description'];
                meta.val(metaValue);
            }
        }
    }

    var tagsform = $('#tagsform');
    if(tagsform.length > 0) {
        loadTags();

        tagsform.submit(function(){
            var tags = $('#tags');
            var tagsVal = tags.val();
            $.post(
                '/admin/blog/tags/ajax-add',
                {
                    tags: tagsVal
                },
                function(data) {
                    if('tags' in data) {
                        appendTags(data);
                    } else if('errors' in data) {
                        console.log(data);
                    }
                    tags.val('');
                },
                'json'
                );
            return false;
        });
    }

    $('.ul_tags li a').live('click', function(){
        var liTag = $(this).parent();
        var tagId = liTag.attr('rel').replace(/tag_id_/,'');
        removeTag(tagId);
        liTag.remove();
        return false;
    });

    loadAllCategories();

    $("#categories-holder .ul_categories li input").live('change', function (event) {
        var target = $(event.target);
        var checked = target.attr('checked');
        var categoryId = target.val();

        var category = $("#related_categories");
        var categoryVal = category.val();

        if (!checked) {
            categoryVal = categoryVal.replace('#' + categoryId + '#', '');
        } else {
            categoryVal = categoryVal + "#" + categoryId + "#";
        }

        category.val(categoryVal);
    });
});


function loadTags() {
    var postIdTag = $('#id');
    if(postIdTag.length != 1) {
        return false;
    }

    var postId = postIdTag.val();

    if(postId == '' || postId == 0) {
        return false;
    }

    $.get(
            '/admin/blog/tags/ajax-load',
            {
                postId: postId
            },
            function(data) {
                if('tags' in data) {
                    appendTags(data);
                } else if('errors' in data) {
                    console.log(data);
                }
            },
            'json'
         );
}

function appendTags(tags) {
    tags = tags['tags'];

    if(tags.length == 0) {
        return false;
    }

    if($('.ul_tags').length == 0) {
        createUlTags();
    }
    var ulTags = $('.ul_tags');
    var liTags = '';
    var postTag = $('#related_tags');

    for(key in tags) {
        var tagId = tags[key]['id'];
        var rel = 'tag_id_' + tagId;
        if($('li[rel='+rel+']').length == 0) {

            var postTagVal = postTag.val();
            postTag.val(postTagVal + '#' + tagId + '#');

            liTags += '<li rel=\'' + rel + '\'>';
            liTags += tags[key]['title'];
            liTags += ' <a href=\'#\'><i class="icon-trash"></i></a>';
            liTags += '</li>';
        }
    }
    ulTags.append(liTags);
}

function removeTag(tagId) {
    var postTag = $('#related_tags');
    var postTagVal = postTag.val();
    postTagVal = postTagVal.replace('#'+tagId+'#','');
    postTag.val(postTagVal);
}

function createUlTags()
{
    $('#tags').parents(".control-group").append('<ul class=\'ul_tags\'></ul>');
}

function loadAllCategories()
{
    $.get(
        '/admin/blog/categories/ajax-load',
        function(data) {
            if('categories' in data) {
                appendCategories(data);

                loadCategories();
            } else if('errors' in data) {
                alert('Error loading categories!');
            }
        },
        'json'
    );
}

function appendCategories(categories)
{
    categories = categories['categories'];

    if(categories.length == 0) {
        return false;
    }

    if($('.ul_categories').length == 0) {
        createUlForCategories();
    }
    var ulTags = $('.ul_categories');
    var liTags = '';

    for(var key in categories) {
        var categoryId = key;
        var rel = 'category_id_' + categoryId;
        if($('li[rel='+rel+']').length == 0) {
            liTags += '<li rel=\'' + rel + '\'>';
            liTags += '<input type="checkbox" name="category" id="category_'+categoryId+'" value="'+categoryId+'"> ';
            liTags += '<label style="display:inline" for="category_'+categoryId+'">' + categories[key] + '</label>';
            liTags += '</li>';
        }
    }
    ulTags.append(liTags);
}

function loadCategories() {
    var idTag = $('#id');
    if(idTag.length != 1) {
        return false;
    }

    var id = idTag.val();

    if(id == '' || id == 0) {
        return false;
    }

    $.get(
        '/admin/blog/categories/ajax-load',
        {
            postId: id
        },
        function(data) {
            if('categories' in data) {
                selectCategories(data);
            } else if('errors' in data) {
                alert('Error loading tags!');
            }
        },
        'json'
    );
}

function selectCategories(categories)
{
    categories = categories['categories'];

    if(categories.length == 0) {
        return false;
    }

    var category = $('#related_categories');

    for(var key in categories) {
        var categoryId = categories[key]['id'];
        var checkbox = $('#category_' + categoryId);
        if (checkbox.length == 1) {
            var categoryVal = category.val();
            category.val(categoryVal + '#' + categoryId + '#');
            checkbox.attr('checked', 'checked');
        }
    }
}

function createUlForCategories()
{
    $('#categories-holder').append('Categories: <ul class=\'ul_categories\'></ul>');
};

