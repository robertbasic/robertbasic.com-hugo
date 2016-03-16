+++
date = "2011-03-15T20:41:42+02:00"
title = "Multiple Dojo tooltips on page load"
slug = "multiple-dojo-tooltips-on-page-load"
description = "A quest to extend dijit.Tooltips so that several tooltips can be shown on a page at the same time."
tags = ["custom tooltips", "dijit.tooltip", "dojo", "tooltips"]
categories = ["Development"]
+++
<p>As I said a few days (weeks?) ago, I've decided to learn dojo and not by just doing random examples, but by changing the whole administration panel for <a href="http://phpplaneta.net">phpplaneta.net</a> to use <a href="http://www.dojotoolkit.org/">dojo</a> and the <a href="http://framework.zend.com/manual/en/zend.dojo.html">Zend_Dojo_* components</a>. Maybe it'll become a bit more usable and prettier :)</p>
<p>Fast forward a few hours into this journey of dojos and dijits and I found myself hacking and extending it just to make it work and behave like I want it to. I knew that this time would come sooner and later, but somehow this was way to soon. All I wanted is to have multiple tooltips pop up soon as the page loads; it couldn't be so hard, right? Right? Well, it wasn't hard, but it sure wasn't easy either.</p>
<p>Note: when first started this post there was a section generally on dojo, which started out as a few words, thoughts, on it, but in the end turned out to be big enough for a separate post. The plan is to finish that once when I get to the end of this "dojo journey".</p>
<p>OK, back to topic. What I wanted to achieve, and to some extent I did, is to show a few dijit tooltips when a page loads, for example after a user has submitted an invalid Zend_Dojo_Form, show the error messages in the tooltips. Bonus points for marking the invalid form elements as invalid a la dijit.form.validationtextbox.</p>
<p>First thing I learnt is that by default there can be only one <a href="http://dojotoolkit.org/reference-guide/dijit/Tooltip.html">dijit.Tooltip</a> shown on the page at a time. A dijit.Tooltip will be shown when the element it is connected to gets focus and will be hidden when the element loses focus. By the logic that there can not be more than one element in focus at a time, dijit.Tooltip works perfectly.</p>
<p>To achieve what I wanted to, I had to make it possible to have several tooltips shown at the same time, all connected to different elements, plus they should be "activated" programmatically on page load, instead of waiting for the user to bring those elements in focus.</p>
<p>Making it possible to have multiple tooltips: the "offending" code that was stopping me from showing multiple tooltips is in dijit/Tooltip.js, around lines 83-93. Be warned, dojo code is a bit cryptic in places and figuring it out takes time. A whole lot of it. That piece of code there is responsible for creating a new tooltip instance each and every time. Luckily, that part can be easily overwritten in our dojo.addOnLoad function:</p>
<pre class="php" name="code">
var ttids = Array();
dijit.showTooltip=function(_a,_b,_c,_d){
    if(!ttids[_b.id]){
        ttids[_b.id]=new dijit._MasterTooltip();
    }
    return ttids[_b.id].show(_a,_b,_c,_d);
};
dijit.hideTooltip=function(_e){
    if(!ttids[_e.id]){
        ttids[_e.id]=new dijit._MasterTooltip();
    }
    return ttids[_e.id].hide(_e);
};
</pre>
<p>Showing those tooltips programatically is a bit harder. I hoped that there's some built-in method which when called will just happily show the tooltip, but I was foolish for having such hopes. Anyway, by looking at how dijit.Tooltip was created/declared, I've wrote my own tooltip which extends dijit.Tooltip and adds the "missing method":</p>
<pre class="php" name="code">
dojo.declare("app.errorTooltip", dijit.Tooltip, {
    show: function() {
        var elem = dojo.byId(this.connectId[0]);
        if(dojo.isIE) {
            elem.fireEvent('onfocus');
        } else {
            var e = document.createEvent("HTMLEvents");
            e.initEvent('focus', false, true);
            elem.dispatchEvent(e);
        }
    }
});
</pre>
<p>Now, when creating a tooltip, instead of dijit.Tooltip I need to use app.errorTooltip (error, as I'm currently using it for showing errors). The contents of the show() method are a different story and they belong to that rant post about dojo I promised earlier :D All that code is actually doing there is firing the "onfocus" event on the element to which our tooltip is connected to.</p>
<p>Finally, querying the DOM for all elements which contain the actual error messages I was first interested in, creating a app.errorTooltip for each of those error message and showing those tooltips with the method I created.</p>
<pre class="php" name="code">
var errors = dojo.query("form ul.errors").forEach(function(node, idx, nodes){
    var id = node.parentNode.firstChild.getAttribute('for');
    var label = "&lt;ul class='errors'&gt;" + node.innerHTML + "&lt;/ul&gt;";
    var tooltip = app.errorTooltip({
        label: label,
        connectId: [id]
    });
    document.body.appendChild(tooltip.domNode);
    tooltip.show();
    // these next 2 lines are for marking the connected fields as invalid
    // as they are also an instance of dijit.form.ValidationTextBox
    dijit.byId(id).state = "Error";
    dijit.byId(id)._setStateClass();
}).style({"display":"none"});
</pre>
<p>There. Multiple dojo tooltips shown on page load. Mission accomplished. As I said, it's not easy, but it's not hard either.</p>
<p>Happy hackin'! :)</p>
