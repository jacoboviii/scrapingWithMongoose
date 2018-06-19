$(document).ready(function(){
    // Delete comment request
    $('.delete-comment').on('click', function(e){
        e.preventDefault(); // Stop the form from causing a page refresh.
        const id = $('.delete-comment').attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/comments/'+id,
            success: function(response){
                // alert('Deletng Comment');
                window.location.href=response;
            },
            error: function(err){
                console.log(err);
            }  
        });
    });
    
    // Delete articles request
    $('.delete-article').on('click', function(e){
        e.preventDefault(); // Stop the form from causing a page refresh.
        const id = $('.delete-article').attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: function(response){
                // alert('Deletng Comment');
                window.location.href=response;
            },
            error: function(err){
                console.log(err);
            }  
        });
    });
});