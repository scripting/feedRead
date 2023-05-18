#### 5/18/23 by DW

Feeds with no items that have <cloud> elements are not getting them through the 9/29/22 workaround.

Added code to workWithNoItemsFeed to fix this. The issue was that cloud elements can have attributes, the others don't.

#### 9/29/22 by DW

If a feed has no items, feedread returns nothing. This is because feedparser sends back head info in each item. If there are no items, we have to head info. So I built a very simple little parser that handles this case.

#### 1/30/19 by DW

Added code to parseFeedString to be sure the callback is only called once.  

#### 1/26/19 by DW

Wired off console.log calls. This level should be reporting the errors, not logging them. 

