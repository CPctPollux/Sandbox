

const scriptsInEvents = {

	async Recherche_sheet_Event7(runtime, localVars)
	{
		    // 1. Find the specific button belonging to the targetID
		    const buttons = runtime.objects.Recherche_Objective.getAllInstances();
		    const targetButton = buttons.find(inst => inst.instVars.TargetID === localVars.targetID);
		    
		    if (targetButton) {
		        targetButton.animationFrame = 1;
		        runtime.callFunction("launchParticle", targetButton.x-(targetButton.width/2), targetButton.y-(targetButton.height/2))
		    }
		
		    // 2. Find and destroy the specific hidden item belonging to the targetID
		    const items = runtime.objects.Recherche_HiddenItems.getAllInstances();
		    const targetItem = items.find(inst => inst.instVars.TargetID === localVars.targetID);
		    
		    if (targetItem) {
		        targetItem.behaviors.Tween.startTween("scale", [1.4, 1.4], 0.3, "out-back");
		        targetItem.behaviors.Fade.startFade();
		
		    }
		
	},

	async Assemblage_sheet_Event29(runtime, localVars)
	{
		const playerInstance = runtime.objects.Player_Base.getFirstInstance();
		const itemInstance = runtime.objects.Assemblage_Items.getFirstPickedInstance();
		const cell = runtime.objects.cell_unselected.getFirstInstance();
		
		if (playerInstance && itemInstance) {
		    const subCategoryName = itemInstance.instVars.Sub_Category;
		
		    // 1. Check if the player is ALREADY wearing this subcategory BEFORE updating it
		    if (playerInstance.instVars[subCategoryName] === true) {
		        const allItems = runtime.objects.Assemblage_Items.getAllInstances();
		
		        // Search for the previously equipped item in the same subcategory
		        for (const oldItem of allItems) {
		            if (
		                oldItem.uid !== itemInstance.uid &&
		                oldItem.instVars.Sub_Category === subCategoryName &&
		                oldItem.instVars.isDocked // Ensure we target the worn item
		            ) {
		                // Unequip old item
		                oldItem.instVars.isDocked = false;
		
		                for (const oldItemGhost of allItems) {
		                   if (
		                        oldItemGhost.instVars.Name === oldItem.instVars.Name &&
		                        oldItemGhost.instVars.isGhost
		                   ) {
		
		                   oldItemGhost.destroy();
		                   break;
		                   }
		                   
		                }
		
		                // Tween old item back to its wardrobe position
		                if (oldItem.behaviors && oldItem.behaviors.Tween) {
		                    oldItem.behaviors.Tween.startTween(
		                        "position",
		                        [oldItem.instVars.SpawnX, oldItem.instVars.SpawnY],
		                        0.2,
		                        "default"
		                    );
		                    oldItem.behaviors.Tween.startTween(
		                        "size",
		                        [cell.width - 50, cell.height - 50],
		                        0.3,
		                        "out-exponential"
		                    )
		                }
		
		                
		                    
		                break; // Found and returned the old item
		            }
		        }
		    }
		
		    // 2. Mark player's boolean for this subcategory as true
		    playerInstance.instVars[subCategoryName] = true;
		
		    // 3. Mark the new item as equipped
		    itemInstance.instVars.isDocked = true;
		}
	},

	async Assemblage_sheet_Event36(runtime, localVars)
	{
		const playerInstance = runtime.objects.Player_Base.getFirstInstance();
		const itemInstance = runtime.objects.Assemblage_Items.getFirstPickedInstance();
		
		if (playerInstance && itemInstance) {
		    const subCategoryName = itemInstance.instVars.Sub_Category;
		
		    if (subCategoryName in playerInstance.instVars) {
		        playerInstance.instVars[subCategoryName] = false;
		    }
		}
	},

	async Main_menu_sheet_Event2(runtime, localVars)
	{
try {
    // 1. Resolve the correct runtime path for games.json
    const jsonUrl = await runtime.assets.getProjectFileUrl("games.json");
    const response = await fetch(jsonUrl);
    const games = await response.json();

    let htmlContent = '<div class="grid-container">';

    for (const game of games) {
        // Resolve the correct runtime path for each image asset
        let imgUrl = "";
        try {
            imgUrl = await runtime.assets.getProjectFileUrl(game.image);
        } catch (e) {
            imgUrl = game.image; // Fallback if direct name fails
        }

        const tagsHTML = game.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        // Store the dynamic layout target in the data-layout attribute
        htmlContent += `
            <div class="card" data-layout="${game.layout || ''}">
                <img class="card-img" src="${imgUrl}" alt="${game.title}">
                <h2 class="card-title">${game.title}</h2>
                <p class="card-sub">Temps de prod : ${game.prod_time}</p>
                <p class="card-desc">${game.description}</p>
                <div class="tags-container">
                    ${tagsHTML}
                </div>
            </div>
        `;
    }

    htmlContent += '</div>';

    // 2. Inject directly into your Construct 3 HTML Element instance
    const htmlElement = runtime.objects.HTMLElement.getFirstInstance();
    
    if (htmlElement) {
        htmlElement.setContent(htmlContent);

        // Access the generated DOM container
        const domElement = htmlElement.getElement();

        if (domElement) {
            // Event delegation: Listen for clicks on the main container
            domElement.addEventListener("click", (e) => {
                // Find if the click happened on or inside a .card element
                const card = e.target.closest(".card");

                if (card) {
                    const targetLayout = card.dataset.layout;

                    if (targetLayout) {
                        setTimeout(() => {
                            runtime.goToLayout(targetLayout);
                        }, 120);
                    } else {
                        console.warn("No layout specified for this card.");
                    }
                }
            });
        } else {
            console.error("DOM Element container not available.");
        }
    } else {
        console.error("HTMLElement object instance not found on layout!");
    }

} catch (err) {
    console.error("Failed to build grid:", err);
}
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
