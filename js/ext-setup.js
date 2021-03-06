Ext.require(['*']);
Ext.onReady(function() {

    var viewport = Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split: true
        },
        items: [
        {
            region: 'east',
            collapsible: true,
            floatable: true,
            split: true,
            width: '25%',
            tbar: playlistControlbar,
            bbar: playlistStatusbar,
            title: 'Playlist',
            layout: 'fit',          
            items: [
                gridMusicPlaylist
            ]
        },
        {
            region: 'center',
            minHeight: 80,
            layout: 'border',
            items: [
                {
                    region: 'north',
                    split: true,
                    title: 'XBMControl Web v1.0.0',
                    height: 170,
                    contentEl: 'tester'
                }, { 
                    region: 'center',
                    margins: '0 0 0 0',
                    autoScroll: true,
                    layout: 'fit',
               		tbar: mediaLibraryStatusbar,
                    items:
                    [{
                        xtype: 'grouptabpanel',
                        tabWidth: 100,
                        activeGroup: 0,
                        margins: '0 0 0 0',
                        listeners: {
                            'beforegroupchange': function( grouptabPanelTemp, newGroup, oldGroup, comp, tab) {
                                setPlaylistType(newGroup.initialConfig.title);
                            },
                            scope: this
                        },
                        items: [{
                                mainitem: 1,
    		                    title: 'Music',
    		                    items: [{    			                    
    				                        title: 'Music',
    				                        items: []
    			                        }, {
    				                        title: 'Files',
    				                        iconCls: 'icon-look-folders',
    				                        layout: 'border',
    				                        split: 'true',
    				                        items: [{
    				                            region: 'center',
    				                            split: true,
    				                            layout: 'fit',
    				                            margins: '0 0 0 0',
    				                            items: sharesMusicTree
                                            }]	
    			                        }, {
    				                        title: 'Library',
    				                        iconCls: 'icon-look-library',
    				                        layout: 'border',
    				                        frame: 'true',
    				                        split: 'true',
    				                        items: [{
     				                            region: 'west',
     				                            width: '25%',
     				                            layout: 'fit',
     				                            split: true,
     				                            margins: '0 0 0 0',
     				                            items: gridGenre
     				                        },
                                            {
                                                region: 'center',
                                                layout: 'fit',
                                                split: true,
                                                margins: '0 0 0 0',
                                                items: gridArtist
                                            },
                                            {
                                                region: 'east',
                                                width: '33%',
                                                layout: 'fit',
                                                split: true,
                                                margins: '0 0 0 0',
                                                items: gridAlbum
                                            }, {
                                                region: 'south',
                                                split: true,
                                                autoScroll: true,
                                                height: 150,
                                                //title: 'Media List',
                                                layout: 'fit',
                                                collapsible: true,
                                                items: gridSongs
                                            }]
                                        }]
                                }, {
                                title: 'Video',
                                items: [{
                                            title: 'Video',
                                            items: []
                                        }, {
                                            title: 'Files',
                                            iconCls: 'icon-look-folders',
                                            layout: 'border',
                                            split: 'true',
                                            layout: 'border',
                                            split: 'true',
                                            items: [{
                                                region: 'center',
                                                split: true,
                                                layout: 'fit',
                                                margins: '0 0 0 0',
                                                items: sharesVideoTree
                                            }]
                                        }, {
                                            title: 'Library',
                                            iconCls: 'icon-look-library',
                                            layout: 'border',
                                            frame: 'true',
                                            split: 'true',
                                            items: [
    				                        {
    				                            region: 'west',
    				                            width: '25%',
    				                            layout: 'fit',
    				                            split: true,
    				                            margins: '0 0 0 0',
    				                            items: gridVideoGenre
    				                        },
                                    		{
                                    		    region: 'center',
                                    		    layout: 'fit',
                                    		    split: true,
                                    		    margins: '0 0 0 0',
                                    		    items: gridVideo
                                            }]
                                        }]
                                }, {
                                items: [{
                                            title: 'TV Shows',
                                            items: []
                                        }, {
                                            title: 'Library',
                                            iconCls: 'icon-look-library',
                                            layout: 'border',
                                            frame: 'true',
                                            split: 'true',
                                            items: [
    				                            {
    				                                region: 'west',
    				                                width: '40%',
    				                                layout: 'fit',
    				                                split: true,
    				                                margins: '0 0 0 0',
    				                                items: gridTVVideo
    				                            },
                                                {
                                                    region: 'center',
                                                    layout: 'fit',
                                                    split: true,
                                                    margins: '0 0 0 0',
                                                    items: gridTVVideoSeason
                                                },
                                                {
                                                    region: 'east',
                                                    width: '33%',
                                                    layout: 'fit',
                                                    split: true,
                                                    margins: '0 0 0 0',
                                                    items: gridTVVideoEpisodes
                                                }                                            
                                            ]
                                        }]
                        }]
		            }]
            }]
            
            
        }]
    });

    GetIntroRetroSpec();
});



var navButtonClearPlaylistVideo = Ext.create('Ext.Button', {
    text: 'Clear Playlist',
    //scope   : this,
    handler: function() {
        buttonClearPlayList();
    }
});

var navButtonReloadPlaylistMusic = Ext.create('Ext.Button', {
    text: 'Refresh Playlist',
    //scope   : this,
    handler: function() {
        updatePlaylistTree();
    }
});

function refreshXBMCMusicLibraries(t) {
    var obj = {
        "jsonrpc": "2.0",
        "method": "AudioLibrary.Scan",
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: refreshMusicLibrarySuccess,
        failure: refreshMusicLibraryFailure,
        timeout: interfaceTimeout
    });
}


function refreshMusicLibraryFailure(t) {
    alert('refreshLibraryFailure t:' + t);
}

function refreshMusicLibrarySuccess(t) {
}

function refreshXBMCVideoLibraries(t) {
    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.Scan",
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        params: tempStr,
        headers: { 'Content-Type': 'application/json' },
        success: refreshVideoLibrarySuccess,
        failure: refreshVideoLibraryFailure,
        timeout: interfaceTimeout
    });
}

function refreshVideoLibraryFailure(t) {
    alert('refreshLibraryFailure t:' + t);
}

function refreshVideoLibrarySuccess(t) {
}

function refreshMediaLibraries(t) {
    InitializeMusicLib();
    InitializeMovieLib();
    InitializeTVShowLib();
    updatePlaylistTree();
}

var navButtonReloadLibraries = new Ext.Button({
    text: 'Refresh Libraries',
    qtip: 'Refresh the Music, Video Libraries',
	menu: [ {text: 'Refesh XBMControl', handler: refreshMediaLibraries},
	        {text: 'Refresh XBMC Music', handler: refreshXBMCMusicLibraries},
	        {text: 'Refresh XBMC Video', handler: refreshXBMCVideoLibraries} ] 
});

var playlistStatusbar = Ext.create('Ext.toolbar.Toolbar', {
    //renderTo: document.body,
    //width: 400,
    items: [
        {
            id: 'playlistStatus',
            text: '0 items' 
        },
        '-',
        { 
            id: 'playlistIndex',
            text: 'Index: 0' 
        },
        '-',
        navButtonClearPlaylistVideo,
        '-',
        navButtonReloadPlaylistMusic
    ]
});


var navButtonLoadPlaylistMusic = Ext.create('Ext.Button', {
    text: 'Load Playlist',
    //scope   : this,
    handler: function() {
        buttonLoadPlayList();
    }
});

var playlistControlbar = Ext.create('Ext.toolbar.Toolbar', {
    //renderTo: document.body,
    //width: 400,
    items: [
        navButtonLoadPlaylistMusic,
    ]
});


//var mediaLibraryStatusbar = new Ext.Toolbar({
//    items: [mediaLibraryStatus, '->', navButtonReloadLibraries]
//});

var mediaLibraryStatusbar = Ext.create('Ext.toolbar.Toolbar', {
    //renderTo: document.body,
    //width: 400,
    items: [
        {
            id: 'mediaLibraryStatus',
            text: 'Ready!' 
        },
        '->',
        navButtonReloadLibraries
    ]
});
