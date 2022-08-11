
// import //
import { syncGameEngine } from "../../abstractions/game mechanism/engines/sync_game_engine.js";
import { patterns_game_elements } from "../../abstractions/game patterns/patterns_game_elements.js";

import { obstacles_administrator } from "../obstacle/obstacle.js";
import { play_field } from '../play field/play_field.js';

// player class //
class Player extends patterns_game_elements.GameComponent {

    // public object properies //
    statuses = {

        fly: {
            class: 'player_fly',
        },

        fall: {
            class: 'player_fall',
        },

        losing_fall: {
            class: 'losing_fall',
        }

    };

    // public object methods //

    // constructor
    constructor({ ...group_objects_with_settings }) {
        super(group_objects_with_settings);
    }

    // start
    startDemonstrationFlight() {

        let demonstration_flight = setInterval(

            function () {

                let presence_class_game_over = play_field.HTML_LINK.classList.contains(
                    play_field.statuses.process_game.class
                );

                if (
                    presence_class_game_over ||
                    !player.HTML_LINK
                ) {
                    clearInterval(demonstration_flight);
                    return;
                }

                let center_of_the_play_field = window.screen.availHeight / 2 - 70;
                let player_below_center_play_field = player.top >= center_of_the_play_field;

                if (player_below_center_play_field) {
                    player.ANIMATIONS_SETTINGS.ANIMATIONS.fly.start();
                }

            }, this.duration_fly + 75

        );

    }

    // check
    checkMovement() {

        let waiting_lose = setInterval(

            function () {

                if (
                    !player.HTML_LINK ||
                    player._checkingCollisionsFloor ||
                    player._checkingCollisionsObstacle
                ) {

                    clearInterval(waiting_lose);
                    play_field.setClassName(
                        play_field.statuses.game_over.class
                    );

                }

            }, 20

        );

    }

    // getter
    get duration_fly() {

        if (window.screen.availHeight > 1070) return 230;

        if (window.screen.availHeight > 896) return 240;

        if (window.screen.availHeight > 768) return 250;

        if (window.screen.availHeight > 640) return 250;

        return 255;

    }

    get duration_fall() {

        if (window.screen.availHeight > 1070) return 1500;

        if (window.screen.availHeight > 896) return 1450;

        if (window.screen.availHeight > 768) return 1450;

        if (window.screen.availHeight > 640) return 1450;

        return 1550;

    }


    // private object methods //

    // getter
    get _checkingCollisionsFloor() {
        if (this.top + this.height >= play_field.height) return true;
    }

    get _checkingCollisionsObstacle() {

        let current_obstacle = obstacles_administrator.current_obstacle;
        if (!current_obstacle) return false;

        let obstacle_top = current_obstacle.querySelector('.obstacle_top');
        let obstacle_bottom = current_obstacle.querySelector('.obstacle_bottom');

        let first_expression =
            this.left <= (current_obstacle.offsetLeft + current_obstacle.offsetWidth)
            &&
            (this.left + this.width) >= current_obstacle.offsetLeft;

        let second_expression =
            this.top <= (obstacle_top.clientHeight - this.height * 0.6)
            ||
            this.height + this.top >= (obstacle_bottom.offsetTop - this.height * 0.6);

        if (first_expression && second_expression) return true;

    }

}

// player object //
const player = new Player({

    HTML_SETTINGS: {

        ID_NAME: 'player',

        tag_name: 'div',
        start_styles:
            `
            left: -150px; 
            top: ${window.screen.availHeight / 2 - 70}px
         `,

    },

    DOM_TREE_SETTINGS: {

        involved_element: '#play_field',
        insert_command: 'prepend'

    },

    ANIMATIONS_SETTINGS: {

        ANIMATIONS: {

            get moving_to_right() {

                return play_field.createAnimation({

                    changing_properties: [

                        {
                            name: 'left',
                            start_value: player.left,
                            final_value: play_field.width / 2 - player.width / 2,
                            unit_of_measurement: 'px',
                        },

                    ],
                    timing_function: {
                        name: player.ANIMATIONS_SETTINGS.TIMING_FUNCTIONS.linear,
                        coefficient: 1
                    },
                    changing_element: player.HTML_LINK,
                    duration: 2000,
                    synchronous: true

                });

            },

            get fly() {

                if (!player.HTML_LINK.classList.contains(player.statuses.fall.class)) return;

                player.ANIMATIONS_SETTINGS.ANIMATIONS.fall.end();
                player.setClassName(player.statuses.fly.class);

                return player.createAnimation({

                    changing_properties: [

                        {
                            name: 'top',
                            start_value: player.top,
                            final_value: player.top - player.height,
                            unit_of_measurement: 'px',
                        },

                    ],
                    timing_function: {
                        name: player.ANIMATIONS_SETTINGS.TIMING_FUNCTIONS.linear,
                        coefficient: 1
                    },
                    changing_element: player.HTML_LINK,
                    duration: player.duration_fly,
                    next_function: function () {
                        player.ANIMATIONS_SETTINGS.ANIMATIONS.fall.start();
                    }

                });

            },

            get fall() {

                player.setClassName(player.statuses.fall.class);

                return player.createAnimation({

                    changing_properties: [

                        {
                            name: 'top',
                            start_value: player.top,
                            final_value: play_field.height - player.height,
                            unit_of_measurement: 'px',
                        },

                    ],
                    timing_function: {
                        name: player.ANIMATIONS_SETTINGS.TIMING_FUNCTIONS.linear,
                        coefficient: 1
                    },
                    changing_element: player.HTML_LINK,
                    duration: player.duration_fall

                });

            },

            get losing_fall() {

                return player.createAnimation({

                    changing_properties: [

                        {
                            name: 'transform',
                            start_value: 0,
                            final_value: 360,
                            function_value: 'rotate',
                            unit_of_measurement: 'deg'
                        },

                    ],
                    timing_function: {
                        name: player.ANIMATIONS_SETTINGS.TIMING_FUNCTIONS.linear,
                        coefficient: 1
                    },
                    changing_element: player.HTML_LINK,
                    duration: 450,
                    synchronous: true,

                });

            },

        }

    },

});

// export //
export { player };