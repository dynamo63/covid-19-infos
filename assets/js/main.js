$(document).ready(function () {
    moment.locale('fr_FR');

    // On vérifie si on a déjà demandé la permission a l'utilisateur
    let neverAsked = getNotificationPermissionAsked();

    // On affiche les boutons de notification s'il n'a pas encore reçu de demande de permission
    if (neverAsked) {
        let notifButtons = $(".button-notif, .text-notif");
        notifButtons.removeClass("hide");
        notifButtons.click(function () {
            Notification.requestPermission(function (status) {
                let n = new Notification("COVID-19 Infos", {body: "Vous recevrez des notifications lorsqu'un contenu sera publié"});
                if (status === 'granted' || status === 'denied') notifButtons.addClass("hide");
            });
        });
    }

    // Gestion du passage d'une rubrique à une autre
    let itemsFooter = $("footer li");
    itemsFooter.click(function () {

        itemsFooter.removeClass("active");
        $(this).addClass("active");

        let section = $($(this).data("target"));
        $("section").removeClass("show");
        section.addClass("show");
    });

    // Récuperation des statistiques
    listen("statistiques", (stats) => {
        stats.forEach((stat) => {
            let data = stat.data();
            $('#contaminations').text(data.contaminations);
            $('#deces').text(data.deces);
            let d = moment(data.updateTime).format("dddd, Do MMMM YYYY");
            $('#updateTime').text(`Mis à jour le ${d}`);
        });
    });

    // Récuperation des publications
    listenPubs("publications", (pubs) => {
        loader("home");

        $("#home .body").empty();
        pubs.forEach((doc) => {
            addPub(doc.data(), "home");
        });

        // Gestion du clic sur les publication
        let elPubs = $('#home .title, #home .image, #home .content > p');
        elPubs.each(function () {
            $(this).click(function () {
                location.href = $(this).data('url');
            });
        });

        // Gestion du clic sur le bouton de partage
        let btns = $('#home .content button');
        btns.each(function () {
            addClickEvent($(this));
        });
        showBody("home");
        loader("home", false);
    });

    // Récuperation des flux rss
    const RSS_URL = `https://www.mediapart.fr/articles/feed`;
    getCovidRSS(RSS_URL);

    // Activation des liens sur desktop
    if(document.body.clientWidth >= 1024 ){
        let navLinks = $(".nav-link a");
        navLinks.click(function () {

            navLinks.removeClass("is-active");
            $(this).addClass("is-active");

        });
    }

});